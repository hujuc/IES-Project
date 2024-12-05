package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

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
        } else {
            System.out.println("No state provided for TV automation.");
        }
    }
}
