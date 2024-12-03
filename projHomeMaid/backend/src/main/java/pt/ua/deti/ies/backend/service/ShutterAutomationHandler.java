package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

@Component
public class ShutterAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public ShutterAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            int openPercentage = state ? (int) changes.getOrDefault("openPercentage", 100) : 0;

            device.setState(state);
            device.setOpenPercentage(openPercentage);

            System.out.println("Shutter state: " + state + ", Open Percentage: " + openPercentage);
            deviceRepository.save(device);
        }
    }
}
