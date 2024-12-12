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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AutomationThreadManager {

    private final AutomationRepository automationRepository;
    private final DeviceRepository deviceRepository;
    private final AutomationHandlerFactory automationHandlerFactory;

    private final ExecutorService executorService;

    public AutomationThreadManager(AutomationRepository automationRepository,
                                   DeviceRepository deviceRepository,
                                   AutomationHandlerFactory automationHandlerFactory) {
        this.automationRepository = automationRepository;
        this.deviceRepository = deviceRepository;
        this.automationHandlerFactory = automationHandlerFactory;
        this.executorService = Executors.newCachedThreadPool(); // Pool de threads dinâmico
    }

    @PostConstruct
    public void startAutomationThread() {
        Thread automationThread = new Thread(() -> {
            while (true) {
                try {
                    System.out.println("[DEBUG] Master thread: Verificando automatizações...");
                    processAutomations();
                    Thread.sleep(60000); // Aguarda 1 minuto antes de verificar novamente
                } catch (InterruptedException e) {
                    System.err.println("[ERROR] Master thread interrompida: " + e.getMessage());
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });

        automationThread.setDaemon(true); // Termina automaticamente com a aplicação
        automationThread.start();
        System.out.println("[DEBUG] Master thread iniciada.");
    }

    private void processAutomations() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        System.out.println("[DEBUG] Master thread: Checando automatizações para " + now);

        List<Automation> automations = automationRepository.findAllByExecutionTime(now);

        System.out.println("[DEBUG] Master thread: Encontradas " + automations.size() + " automatizações.");
        for (Automation automation : automations) {
            System.out.println("[DEBUG] Delegando execução para automatização(ões)");

            executorService.submit(() -> {
                try {
                    executeAutomation(automation);
                } catch (Exception e) {
                    System.err.println("[ERROR]: " + e.getMessage());
                }
            });
        }
    }

    private void executeAutomation(Automation automation) {
        try {
            System.out.println("[DEBUG] Executando automação para dispositivo: " + automation.getDeviceId());
            Device device = deviceRepository.findById(automation.getDeviceId())
                    .orElseThrow(() -> new RuntimeException("[ERROR] Dispositivo não encontrado: " + automation.getDeviceId()));

            System.out.println("[DEBUG] Encontrado dispositivo: " + device.getName() + " do tipo " + device.getType());
            DeviceAutomationHandler handler = automationHandlerFactory.getHandler(device.getType());
            handler.executeAutomation(device, automation.getChanges());
        } catch (Exception e) {
            System.err.println("[ERROR] Erro ao executar automação: " + e.getMessage());
        }
    }

    public void shutdown() {
        System.out.println("[DEBUG] Finalizando executor de threads.");
        executorService.shutdown();
    }
}
