package pt.ua.deti.ies.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.Map;

@Document(collection = "automations")
public class Automation {

    private String deviceId;
    private LocalTime executionTime;
    private Map<String, Object> changes;

    public Automation(String deviceId, LocalTime executionTime, Map<String, Object> changes) {
        this.deviceId = deviceId;
        this.executionTime = executionTime;
        this.changes = changes;
    }

    public Automation() {}

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalTime getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(LocalTime executionTime) {
        this.executionTime = executionTime;
    }

    public Map<String, Object> getChanges() {
        return changes;
    }

    public void setChanges(Map<String, Object> changes) {
        this.changes = changes;
    }
}
