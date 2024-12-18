package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class TVAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public TVAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);

            if (state) {
                int volume = changes.containsKey("volume")
                        ? ((Number) changes.get("volume")).intValue()
                        : device.getVolume();

                int brightness = changes.containsKey("brightness")
                        ? ((Number) changes.get("brightness")).intValue()
                        : device.getBrightness();

                device.setVolume(volume);
                device.setBrightness(brightness);
            }

            deviceRepository.save(device);
        }
    }
}
