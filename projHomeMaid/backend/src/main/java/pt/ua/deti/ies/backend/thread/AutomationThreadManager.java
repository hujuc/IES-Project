package pt.ua.deti.ies.backend.thread;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Automation;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.AutomationRepository;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.service.AutomationHandlerFactory;
import pt.ua.deti.ies.backend.service.DeviceAutomationHandler;

import javax.annotation.PostConstruct;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AutomationThreadManager {

    private final AutomationRepository automationRepository;
    private final DeviceRepository deviceRepository;
    private final AutomationHandlerFactory automationHandlerFactory;

    public AutomationThreadManager(AutomationRepository automationRepository,
                                   DeviceRepository deviceRepository,
                                   AutomationHandlerFactory automationHandlerFactory) {
        this.automationRepository = automationRepository;
        this.deviceRepository = deviceRepository;
        this.automationHandlerFactory = automationHandlerFactory;
    }

    @PostConstruct
    public void startAutomationThread() {
        Thread automationThread = new Thread(() -> {
            while (true) {
                try {
                    processAutomations();
                    Thread.sleep(60000); // Aguarda 1 minuto antes de verificar novamente
                } catch (InterruptedException e) {
                    System.err.println("Automation thread interrupted: " + e.getMessage());
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });

        automationThread.setDaemon(true); // Termina automaticamente com a aplicação
        automationThread.start();
    }

    private void processAutomations() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        System.out.println("Thread running at: " + now);

        List<Automation> automations = automationRepository.findAllByExecutionTime(now);

        for (Automation automation : automations) {
            System.out.println("Executing automation: " + automation);
            executeAutomation(automation);
        }
    }

    private void executeAutomation(Automation automation) {
        Device device = deviceRepository.findById(automation.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        DeviceAutomationHandler handler = automationHandlerFactory.getHandler(device.getType());
        handler.executeAutomation(device, automation.getChanges());
    }
}
