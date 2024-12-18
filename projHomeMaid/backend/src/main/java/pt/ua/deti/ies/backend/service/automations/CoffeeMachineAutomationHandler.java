package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;

@Component
public class CoffeeMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService;

    public CoffeeMachineAutomationHandler(DeviceRepository deviceRepository,
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

        if (changes.containsKey("drinkType")) {
            device.setDrinkType((String) changes.get("drinkType"));
        }

        device.setState(true);
        deviceRepository.save(device);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                device.setState(false);
                deviceRepository.save(device);

                try {
                    String deviceJson = new ObjectMapper().writeValueAsString(device);
                    simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                if (Boolean.TRUE.equals(device.getReceiveAutomationNotification())) {
                    sendCycleCompletedNotification(device, changes.get("drinkType"));
                }
            }
        }, 30000);
    }

    private void sendCycleCompletedNotification(Device device, Object drinkTypeObj) {
        try {
            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId());
            String drinkType = (drinkTypeObj != null) ? drinkTypeObj.toString() : "your drink";
            String notificationText = "The preparation of " + drinkType + " by " + device.getName() + " is completed.";

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
