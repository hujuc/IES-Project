package pt.ua.deti.ies.backend.thread;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Automation;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.repository.AutomationRepository;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.repository.NotificationRepository;
import pt.ua.deti.ies.backend.service.AutomationHandlerFactory;
import pt.ua.deti.ies.backend.service.DeviceAutomationHandler;
import pt.ua.deti.ies.backend.service.DeviceService;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AutomationThreadManager {

    private final AutomationRepository automationRepository;
    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final AutomationHandlerFactory automationHandlerFactory;
    private final DeviceService deviceService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ExecutorService executorService;

    public AutomationThreadManager(AutomationRepository automationRepository,
                                   DeviceRepository deviceRepository,
                                   NotificationRepository notificationRepository,
                                   AutomationHandlerFactory automationHandlerFactory,
                                   DeviceService deviceService,
                                   SimpMessagingTemplate simpMessagingTemplate) {
        this.automationRepository = automationRepository;
        this.deviceRepository = deviceRepository;
        this.notificationRepository = notificationRepository;
        this.automationHandlerFactory = automationHandlerFactory;
        this.deviceService = deviceService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.executorService = Executors.newFixedThreadPool(30);
    }

    @PostConstruct
    public void startAutomationScheduler() {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        long initialDelay = calculateInitialDelay();
        System.out.println("[INFO] Initial delay for scheduler: " + initialDelay + " ms");

        scheduler.scheduleAtFixedRate(() -> {
            try {
                LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
                System.out.println("[INFO] Processing automations for time: " + now);

                processAutomations();
            } catch (Exception e) {
                System.err.println("[ERROR] Exception in automation scheduler: " + e.getMessage());
                e.printStackTrace();
            }
        }, initialDelay, 60 * 1000, TimeUnit.MILLISECONDS);

        System.out.println("[INFO] Automation scheduler started.");
    }

    private long calculateInitialDelay() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextMinute = now.plusMinutes(1).truncatedTo(ChronoUnit.MINUTES);
        return ChronoUnit.MILLIS.between(now, nextMinute);
    }

    private long calculateWaitTimeUntilNextMinute() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextMinute = now.plusMinutes(1).truncatedTo(ChronoUnit.MINUTES);
        return ChronoUnit.MILLIS.between(now, nextMinute);
    }

    private void processAutomations() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        try {
            List<Automation> automations = automationRepository.findAllByExecutionTime(now);

            if (automations.isEmpty()) {
                System.out.println("[INFO] No automations scheduled for: " + now);
            } else {
                System.out.println("[INFO] Found " + automations.size() + " automations to process.");
            }

            for (Automation automation : automations) {
                executorService.submit(() -> {
                    try {
                        executeAutomation(automation);
                    } catch (Exception e) {
                        System.err.println("[ERROR] Error executing automation: " + e.getMessage());
                        e.printStackTrace();
                    }
                });
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Error fetching automations: " + e.getMessage());
        }
    }

    private void executeAutomation(Automation automation) {
        try {
            Device device = deviceRepository.findById(automation.getDeviceId())
                    .orElseThrow(() -> new RuntimeException("[ERROR] Device not found: " + automation.getDeviceId()));

            String houseId = deviceService.getHouseIdByDeviceId(device.getDeviceId());
            if (houseId == null) {
                throw new RuntimeException("[ERROR] House associated with device not found.");
            }

            DeviceAutomationHandler handler = automationHandlerFactory.getHandler(device.getType());
            handler.executeAutomation(device, automation.getChanges());

            broadcastDeviceUpdate(device);

            if (Boolean.TRUE.equals(device.getReceiveAutomationNotification())) {
                createAndSendNotification(device, houseId);
            }

            System.out.println("[INFO] Automation executed for device: " + device.getName());
        } catch (Exception e) {
            System.err.println("[ERROR] Error during automation execution: " + e.getMessage());
        }
    }

    private void broadcastDeviceUpdate(Device device) {
        try {
            String deviceJson = new ObjectMapper().writeValueAsString(device);
            System.out.println("[INFO] Broadcasting device update: " + deviceJson);
            simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
        } catch (Exception e) {
            System.err.println("[ERROR] Error broadcasting device update: " + e.getMessage());
        }
    }

    private void createAndSendNotification(Device device, String houseId) {
        try {
            Notification notification = new Notification(
                    houseId,
                    "The automation for " + device.getName() + " was activated.",
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
            System.err.println("[ERROR] Error creating or sending notification: " + e.getMessage());
        }
    }
}
