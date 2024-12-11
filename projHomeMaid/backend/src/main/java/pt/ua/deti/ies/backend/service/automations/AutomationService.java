package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Automation;
import pt.ua.deti.ies.backend.repository.AutomationRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class AutomationService {

    private final AutomationRepository automationRepository;

    public AutomationService(AutomationRepository automationRepository) {
        this.automationRepository = automationRepository;
    }

    public Automation createOrUpdateAutomation(String deviceId, LocalTime executionTime, Map<String, Object> changes) {
        Automation automation = new Automation(deviceId, executionTime, changes);
        return automationRepository.save(automation);
    }

    public List<Automation> getAllAutomations() {
        return automationRepository.findAll();
    }

    public void deleteAutomation(String deviceId, LocalTime executionTime) {
        automationRepository.deleteByDeviceIdAndExecutionTime(deviceId, executionTime);
    }
}
