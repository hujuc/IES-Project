package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

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

            if (state) {
                // Recupera o brilho ou usa o brilho atual do dispositivo
                int brightness = changes.containsKey("brightness")
                        ? ((Number) changes.get("brightness")).intValue()
                        : device.getBrightness();

                // Limita o brilho a um intervalo aceitável (10-100)
                brightness = Math.max(10, Math.min(brightness, 100));

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
        } else {
            System.out.println("No state provided for lamp automation.");
        }
    }
}
