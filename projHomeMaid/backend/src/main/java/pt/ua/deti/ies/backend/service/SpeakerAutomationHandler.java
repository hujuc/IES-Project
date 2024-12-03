package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

@Component
public class SpeakerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public SpeakerAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        System.out.println("Executing automation for Speaker: " + device.getDeviceId());

        // Atualiza o estado do Speaker
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);
            System.out.println("Set state to: " + state);
        }

        // Atualiza o volume do Speaker
        if (changes.containsKey("volume")) {
            int volume = (int) changes.get("volume");
            device.setVolume(volume);
            System.out.println("Set volume to: " + volume);
        }

        // Salva as mudanças no repositório
        deviceRepository.save(device);
        System.out.println("Speaker automation executed for device: " + device.getDeviceId());
    }
}
