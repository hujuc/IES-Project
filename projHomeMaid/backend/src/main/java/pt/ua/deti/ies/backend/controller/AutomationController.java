package pt.ua.deti.ies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.model.Automation;
import pt.ua.deti.ies.backend.service.*;

import java.time.LocalTime;
import java.util.List;

@CrossOrigin(
        origins = {
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.POST
        })
@RestController
@RequestMapping("/api/automations")
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    @PostMapping
    public ResponseEntity<Automation> createAutomation(@RequestBody Automation automation) {
        return ResponseEntity.ok(automationService.createOrUpdateAutomation(
                automation.getDeviceId(),
                automation.getExecutionTime(),
                automation.getChanges()
        ));
    }

    @DeleteMapping("/{deviceId}/{executionTime}")
    public ResponseEntity<Void> deleteAutomation(@PathVariable String deviceId, @PathVariable String executionTime) {
        automationService.deleteAutomation(deviceId, LocalTime.parse(executionTime));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Automation>> getAllAutomations() {
        return ResponseEntity.ok(automationService.getAllAutomations());
    }
}
