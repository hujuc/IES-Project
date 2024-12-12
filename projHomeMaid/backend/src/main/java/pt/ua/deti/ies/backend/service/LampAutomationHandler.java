package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class LampAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public LampAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");

            if (state) {
                // Recupera o brilho ou usa o brilho atual do dispositivo
                int brightness = changes.containsKey("brightness")
                        ? ((Number) changes.get("brightness")).intValue()
                        : device.getBrightness();

                // Limita o brilho a um intervalo aceitável (1-100)
                brightness = Math.max(1, Math.min(brightness, 100));

                // Recupera a cor ou usa a cor atual do dispositivo
                String color = changes.containsKey("color")
                        ? (String) changes.get("color")
                        : device.getColor();

                // Aplica mudanças ao dispositivo
                device.setBrightness(brightness);
                device.setColor(color);

                System.out.println("Lamp turned ON with brightness: " + brightness + " and color: " + color);
            } else {
                System.out.println("Lamp turned OFF.");
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
            System.out.println("No state provided for lamp automation.");
        }
    }
}
