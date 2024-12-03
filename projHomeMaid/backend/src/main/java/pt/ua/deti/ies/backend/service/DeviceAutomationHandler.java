package pt.ua.deti.ies.backend.service;

import pt.ua.deti.ies.backend.model.Device;

import java.util.Map;

public interface DeviceAutomationHandler {
    void executeAutomation(Device device, Map<String, Object> changes);
}
