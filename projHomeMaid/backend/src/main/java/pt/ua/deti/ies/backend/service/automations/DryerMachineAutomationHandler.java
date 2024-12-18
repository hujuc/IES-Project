package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.repository.NotificationRepository;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;

import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class DryerMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService;

    public DryerMachineAutomationHandler(DeviceRepository deviceRepository,
                                         NotificationRepository notificationRepository,
                                         SimpMessagingTemplate simpMessagingTemplate,
                                         DeviceService deviceService) {
        this.deviceRepository = deviceRepository;
        this.notificationRepository = notificationRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.deviceService = deviceService;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state") && (boolean) changes.get("state")) {
            Object temperatureObj = changes.getOrDefault("temperature", device.getTemperature());
            double temperature = 0;

            if (temperatureObj instanceof Double) {
                temperature = (Double) temperatureObj;
            } else if (temperatureObj instanceof Integer) {
                temperature = ((Integer) temperatureObj).doubleValue();
            }

            String dryMode = (String) changes.getOrDefault("dryMode", device.getMode());

            device.setState(true);
            device.setTemperature(temperature);
            device.setMode(dryMode);
            deviceRepository.save(device);

            new Thread(() -> runDryCycle(device)).start();
        }
    }

    private void runDryCycle(Device device) {
        try {
            Thread.sleep(120000);
            device.setState(false);
            deviceRepository.save(device);

            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (Boolean.TRUE.equals(device.getReceiveAutomationNotification())) {
                sendCycleCompletedNotification(device);
            }

        } catch (InterruptedException e) {
            System.err.println("Dryer Machine cycle was interrupted.");
            Thread.currentThread().interrupt();
        } catch (Exception ex) {
            System.err.println("An error occurred during the drying cycle: " + ex.getMessage());
        }
    }

    private void sendCycleCompletedNotification(Device device) {
        try {
            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId());
            String notificationText = "The drying cycle for " + device.getName() + " has completed.";

            Notification notification = new Notification(
                    houseId,
                    notificationText,
                    LocalDateTime.now(),
                    false,
                    "automationNotification"
            );

            Notification savedNotification = notificationRepository.save(notification);

            NotificationMessage notificationMessage = new NotificationMessage();
            notificationMessage.setHouseId(savedNotification.getHouseId());
            notificationMessage.setText(savedNotification.getText());
            notificationMessage.setType(savedNotification.getType());
            notificationMessage.setTimestamp(savedNotification.getTimestamp().toString());
            notificationMessage.setMongoId(savedNotification.getMongoId());

            simpMessagingTemplate.convertAndSend("/topic/notifications", notificationMessage);
        } catch (Exception e) {
            System.err.println("[ERROR] Error creating cycle completion notification: " + e.getMessage());
        }
    }
}
