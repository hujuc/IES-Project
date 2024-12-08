package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class CoffeeMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public CoffeeMachineAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
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

        try {
            String deviceJson = new ObjectMapper().writeValueAsString(device);
            System.out.println("Broadcasting update: " + deviceJson);
            simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
        } catch (Exception e) {
            e.printStackTrace();
        }

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                device.setState(false);
                deviceRepository.save(device);
                System.out.println("Device state set to OFF after 30 seconds");

                try {
                    String deviceJson = new ObjectMapper().writeValueAsString(device);
                    System.out.println("Broadcasting update after timeout: " + deviceJson);
                    simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, 30000);

    }
}
