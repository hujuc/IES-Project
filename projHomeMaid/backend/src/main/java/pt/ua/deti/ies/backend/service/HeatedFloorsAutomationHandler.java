package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class HeatedFloorsAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public HeatedFloorsAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");

            if (state) {
                // Recupera a temperatura ou usa a temperatura atual do dispositivo
                double temperature = changes.containsKey("temperature")
                        ? ((Number) changes.get("temperature")).doubleValue()
                        : device.getTemperature();

                device.setTemperature(temperature);
                System.out.println("Heated floors turned ON with temperature: " + temperature + "°C");
            } else {
                System.out.println("Heated floors turned OFF.");
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
            System.out.println("No state provided for heated floors automation.");
        }
    }
}
