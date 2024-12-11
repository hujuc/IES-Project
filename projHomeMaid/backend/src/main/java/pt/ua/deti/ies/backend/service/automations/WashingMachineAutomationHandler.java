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

@Component
public class WashingMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService; // Adicionado para obter o houseId

    public WashingMachineAutomationHandler(DeviceRepository deviceRepository,
                                           NotificationRepository notificationRepository,
                                           SimpMessagingTemplate simpMessagingTemplate,
                                           DeviceService deviceService) { // Injetar o serviço de dispositivos
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
            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("Washing Machine started with:");
            System.out.println("Temperature: " + temperature);
            System.out.println("Wash Mode: " + washMode);

            new Thread(() -> runWashCycle(device)).start();
        }
    }

    private void runWashCycle(Device device) {
        try {
            Thread.sleep(120000); // Simulate 2-minute washing cycle
            device.setState(false); // Set state to false after the cycle
            deviceRepository.save(device);
            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("Washing Machine cycle completed. Turned off.");

            // Enviar notificação ao final do ciclo
            sendCycleCompletedNotification(device);

        } catch (InterruptedException e) {
            System.err.println("Washing Machine cycle was interrupted.");
            Thread.currentThread().interrupt();
        } catch (Exception ex) {
            System.err.println("An error occurred during the washing cycle: " + ex.getMessage());
        }
    }

    private void sendCycleCompletedNotification(Device device) {
        try {
            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId()); // Obter o houseId
            String notificationText = "The washing cycle for " + device.getName() + " has completed.";

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
