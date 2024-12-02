package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

@Component
public class CoffeeMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public CoffeeMachineAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        System.out.println("Executing automation for Coffee Machine: " + device.getDeviceId());

        if (changes.containsKey("drinkType")) {
            device.setDrinkType((String) changes.get("drinkType"));
            System.out.println("Set drinkType to: " + changes.get("drinkType"));
        }

        device.setState(true);
        deviceRepository.save(device);
        System.out.println("Device state set to ON");

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                device.setState(false);
                deviceRepository.save(device);
                System.out.println("Device state set to OFF after 30 seconds");
            }
        }, 30000);
    }
}
