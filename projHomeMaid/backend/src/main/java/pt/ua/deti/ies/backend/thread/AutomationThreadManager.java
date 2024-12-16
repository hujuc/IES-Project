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

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AutomationThreadManager {

    private final AutomationRepository automationRepository;
    private final DeviceRepository deviceRepository;
    private final NotificationRepository notificationRepository;
    private final AutomationHandlerFactory automationHandlerFactory;
    private final DeviceService deviceService;

    private final ExecutorService executorService;

    public AutomationThreadManager(AutomationRepository automationRepository,
                                   DeviceRepository deviceRepository,
                                   NotificationRepository notificationRepository,
                                   AutomationHandlerFactory automationHandlerFactory,
                                   DeviceService deviceService) {
        this.automationRepository = automationRepository;
        this.deviceRepository = deviceRepository;
        this.notificationRepository = notificationRepository;
        this.automationHandlerFactory = automationHandlerFactory;
        this.deviceService = deviceService;
        this.executorService = Executors.newCachedThreadPool();
    }

    @PostConstruct
    public void startAutomationThread() {
        Thread automationThread = new Thread(() -> {
            while (true) {
                try {
                    // Sincronizar com o próximo minuto
                    long waitTime = calculateWaitTimeUntilNextMinute();
                    Thread.sleep(waitTime);

                    // Processar as automações
                    processAutomations();
                } catch (InterruptedException e) {
                    System.err.println("[ERROR] Automation thread interrupted: " + e.getMessage());
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });

        automationThread.setDaemon(true); // Thread termina com a aplicação
        automationThread.start();
        System.out.println("[INFO] Automation thread started.");
    }

    private long calculateWaitTimeUntilNextMinute() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextMinute = now.plusMinutes(1).truncatedTo(ChronoUnit.MINUTES);
        return ChronoUnit.MILLIS.between(now, nextMinute);
    }

    private void processAutomations() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        System.out.println("[INFO] Checking automations for execution at: " + now);

        // Buscar automações que estão programadas para este minuto
        List<Automation> automations = automationRepository.findAllByExecutionTime(now);
        System.out.println("[INFO] Found " + automations.size() + " automations to process.");

        for (Automation automation : automations) {
            executorService.submit(() -> {
                try {
                    executeAutomation(automation);
                } catch (Exception e) {
                    System.err.println("[ERROR] Error executing automation: " + e.getMessage());
                }
            });
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

            sendAutomationNotification(device, houseId);

            System.out.println("[INFO] Automation executed for device: " + device.getName());
        } catch (Exception e) {
            System.err.println("[ERROR] Error during automation execution: " + e.getMessage());
        }
    }

    private void sendAutomationNotification(Device device, String houseId) {
        try {
            if (Boolean.FALSE.equals(device.getReceiveAutomationNotification())) {
                System.out.println("[INFO] Device opted out of automation notifications: " + device.getName());
                return;
            }

            String notificationText = "The automation for " + device.getName() + " was activated.";
            Notification notification = new Notification(
                    houseId,
                    notificationText,
                    LocalDateTime.now(),
                    false,
                    "automationNotification"
            );

            notificationRepository.save(notification);

            System.out.println("[INFO] Notification created: " + notificationText);
        } catch (Exception e) {
            System.err.println("[ERROR] Error creating notification: " + e.getMessage());
        }
    }
}