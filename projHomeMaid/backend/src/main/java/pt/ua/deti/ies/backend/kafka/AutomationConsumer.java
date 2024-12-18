package pt.ua.deti.ies.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Automation;
import pt.ua.deti.ies.backend.service.AutomationService;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class AutomationConsumer {

    private final AutomationService automationService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public AutomationConsumer(AutomationService automationService, ObjectMapper objectMapper, SimpMessagingTemplate messagingTemplate) {
        this.automationService = automationService;
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "device_automations", groupId = "automations-group")
    public void consumeDeviceAutomation(ConsumerRecord<String, String> record) {
        try {
            Map<String, Object> automationData = objectMapper.readValue(record.value(), Map.class);

            String deviceId = (String) automationData.get("deviceId");
            String executionTimeString = (String) automationData.get("executionTime");

            String timeOnly = executionTimeString.substring(executionTimeString.indexOf('T') + 1, executionTimeString.indexOf('.'));
            LocalTime executionTime = LocalTime.parse(timeOnly, DateTimeFormatter.ISO_LOCAL_TIME);

            automationData.remove("deviceId");
            automationData.remove("executionTime");

            Automation automation = new Automation(deviceId, executionTime, automationData);

            automationService.createOrUpdateAutomation(deviceId, executionTime, automation.getChanges());

            messagingTemplate.convertAndSend("/topic/device-updates", automation);

            System.out.println("Automação consumida, salva e enviada por WebSocket: " + automation);
        } catch (Exception e) {
            System.err.println("Erro ao consumir automação: " + e.getMessage());
        }
    }
}
