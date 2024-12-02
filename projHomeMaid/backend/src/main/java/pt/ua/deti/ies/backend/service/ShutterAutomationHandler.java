package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

@Component
public class ShutterAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public ShutterAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("openPercentage")) {
            int openPercentage = (int) changes.get("openPercentage");

            if (openPercentage == 0) {
                device.setOpenPercentage(0);
                device.setState(false); // Fecha a persiana
                System.out.println("Shutter closed, state set to false.");
            } else {
                device.setOpenPercentage(openPercentage);
                device.setState(true); // Abre a persiana
                System.out.println("Shutter opened to " + openPercentage + "%, state set to true.");
            }

            deviceRepository.save(device);
            System.out.println("Shutter automation executed for device: " + device.getDeviceId());
        } else {
            System.out.println("No openPercentage provided in automation changes.");
        }
    }
}
