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

@Component
public class CoffeeMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService; // Para obter houseId

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
        System.out.println("Executing automation for Coffee Machine: " + device.getDeviceId());

        if (changes.containsKey("drinkType")) {
            device.setDrinkType((String) changes.get("drinkType"));
            System.out.println("Set drinkType to: " + changes.get("drinkType"));
        }

        device.setState(true);
        deviceRepository.save(device);
        System.out.println("Device state set to ON");

        try {
            String deviceJson = new ObjectMapper().writeValueAsString(device);
            System.out.println("Broadcasting update: " + deviceJson);
            simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Simula a preparação da bebida por 30 segundos
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                device.setState(false);
                deviceRepository.save(device);
                System.out.println("Device state set to OFF after 30 seconds");

                try {
                    String deviceJson = new ObjectMapper().writeValueAsString(device);
                    System.out.println("Broadcasting update after timeout: " + deviceJson);
                    simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                // Enviar notificação de conclusão do ciclo
                sendCycleCompletedNotification(device, changes.get("drinkType"));
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
                    false, // Não lida
                    "cycleCompletedNotification" // Tipo de notificação
            );

            notificationRepository.save(notification);
            System.out.println("[INFO] Cycle completion notification created: " + notificationText);
        } catch (Exception e) {
            System.err.println("[ERROR] Error creating cycle completion notification: " + e.getMessage());
        }
    }
}
