package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class LampAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public LampAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);

            if (state) {
                int brightness = changes.containsKey("brightness")
                        ? ((Number) changes.get("brightness")).intValue()
                        : device.getBrightness();

                brightness = Math.max(1, Math.min(brightness, 100));

                String color = changes.containsKey("color")
                        ? (String) changes.get("color")
                        : device.getColor();

                device.setBrightness(brightness);
                device.setColor(color);
            }

            deviceRepository.save(device);
        }
    }
}
