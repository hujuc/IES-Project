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
public class DryerMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final DeviceService deviceService; // For houseId retrieval

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
            // Fetch values from changes or use current device values
            Object temperatureObj = changes.getOrDefault("temperature", device.getTemperature());
            double temperature = 0;

            // Handle temperature as a double
            if (temperatureObj instanceof Double) {
                temperature = (Double) temperatureObj;
            } else if (temperatureObj instanceof Integer) {
                temperature = ((Integer) temperatureObj).doubleValue();
            }

            String dryMode = (String) changes.getOrDefault("dryMode", device.getMode());

            // Update device state
            device.setState(true);
            device.setTemperature(temperature);
            device.setMode(dryMode);
            deviceRepository.save(device);
            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("Dryer Machine started with:");
            System.out.println("Temperature: " + temperature);
            System.out.println("Dry Mode: " + dryMode);

            // Simulate drying cycle using a separate thread
            new Thread(() -> runDryCycle(device)).start();
        }
    }

    private void runDryCycle(Device device) {
        try {
            Thread.sleep(3000); // Simulate 2-minute drying cycle
            device.setState(false); // Set state to false after the cycle
            deviceRepository.save(device);
            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("Dryer Machine cycle completed. Turned off.");

            // Send notification for cycle completion
            sendCycleCompletedNotification(device);

        } catch (InterruptedException e) {
            System.err.println("Dryer Machine cycle was interrupted.");
            Thread.currentThread().interrupt();
        } catch (Exception ex) {
            System.err.println("An error occurred during the drying cycle: " + ex.getMessage());
        }
    }

    private void sendCycleCompletedNotification(Device device) {
        try {
            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId()); // Get houseId
            String notificationText = "The drying cycle for " + device.getName() + " has completed.";

            Notification notification = new Notification(
                    houseId,
                    notificationText,
                    LocalDateTime.now(),
                    false, // Mark as unread
                    "cycleCompletedNotification" // Notification type
            );

            notificationRepository.save(notification);
            System.out.println("[INFO] Cycle completion notification created: " + notificationText);
        } catch (Exception e) {
            System.err.println("[ERROR] Error creating cycle completion notification: " + e.getMessage());
        }
    }
}
