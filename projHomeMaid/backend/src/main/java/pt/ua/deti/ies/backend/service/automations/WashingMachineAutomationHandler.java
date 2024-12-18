package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;

@Component
public class WashingMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService;

    public WashingMachineAutomationHandler(DeviceRepository deviceRepository,
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

            String washMode = (String) changes.getOrDefault("washMode", device.getMode());

            device.setState(true);
            device.setTemperature(temperature);
            device.setMode(washMode);
            deviceRepository.save(device);

            new Thread(() -> runWashCycle(device)).start();
        }
    }

    private void runWashCycle(Device device) {
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
            System.err.println("Washing Machine cycle was interrupted.");
            Thread.currentThread().interrupt();
        } catch (Exception ex) {
            System.err.println("An error occurred during the washing cycle: " + ex.getMessage());
        }
    }

    private void sendCycleCompletedNotification(Device device) {
        try {
            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId());
            String notificationText = "The washing cycle for " + device.getName() + " has completed.";

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
