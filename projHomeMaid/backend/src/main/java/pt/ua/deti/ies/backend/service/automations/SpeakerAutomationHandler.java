package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class SpeakerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public SpeakerAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);
        }

        if (changes.containsKey("volume")) {
            int volume = (int) changes.get("volume");
            device.setVolume(volume);
        }

        deviceRepository.save(device);
    }
}
