package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class SpeakerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public SpeakerAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
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
        try {
            String deviceJson = new ObjectMapper().writeValueAsString(device);
            System.out.println("Broadcasting update: " + deviceJson);
            simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Speaker automation executed for device: " + device.getDeviceId());
    }
}
