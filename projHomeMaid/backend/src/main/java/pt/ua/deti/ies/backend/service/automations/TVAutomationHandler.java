package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class TVAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public TVAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");

            if (state) {
                // Recupera o volume ou usa o volume atual do dispositivo
                int volume = changes.containsKey("volume")
                        ? ((Number) changes.get("volume")).intValue()
                        : device.getVolume();

                // Recupera o brilho ou usa o brilho atual do dispositivo
                int brightness = changes.containsKey("brightness")
                        ? ((Number) changes.get("brightness")).intValue()
                        : device.getBrightness();

                device.setVolume(volume);
                device.setBrightness(brightness);

                System.out.println("TV turned ON with volume: " + volume + ", brightness: " + brightness);
            } else {
                System.out.println("TV turned OFF.");
            }

            device.setState(state);

            // Salva as alterações no repositório
            deviceRepository.save(device);
            try {
                String deviceJson = new ObjectMapper().writeValueAsString(device);
                System.out.println("Broadcasting update: " + deviceJson);
                simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            System.out.println("No state provided for TV automation.");
        }
    }
}
