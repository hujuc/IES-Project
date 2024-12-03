package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

@Component
public class WashingMachineAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public WashingMachineAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state") && (boolean) changes.get("state")) {
            // Fetch values from changes or use current device values
            Object temperatureObj = changes.getOrDefault("temperature", device.getTemperature());
            double temperature = 0;

            // Ensure that temperature is handled as a double
            if (temperatureObj instanceof Double) {
                temperature = (Double) temperatureObj;
            } else if (temperatureObj instanceof Integer) {
                temperature = ((Integer) temperatureObj).doubleValue();  // Convert Integer to Double
            }

            String washMode = (String) changes.getOrDefault("washMode", device.getMode());

            // Update device state
            device.setState(true);
            device.setTemperature(temperature);
            device.setMode(washMode);
            deviceRepository.save(device);

            System.out.println("Washing Machine started with:");
            System.out.println("Temperature: " + temperature);
            System.out.println("Wash Mode: " + washMode);

            // Simulate washing cycle using a separate thread
            new Thread(() -> runWashCycle(device)).start();
        }
    }

    private void runWashCycle(Device device) {
        try {
            Thread.sleep(120000); // Simulate 2-minute washing cycle
            device.setState(false); // Set state to false after the cycle
            deviceRepository.save(device);

            System.out.println("Washing Machine cycle completed. Turned off.");
        } catch (InterruptedException e) {
            System.err.println("Washing Machine cycle was interrupted.");
            Thread.currentThread().interrupt(); // Preserve interrupt status
        } catch (Exception ex) {
            System.err.println("An error occurred during the washing cycle: " + ex.getMessage());
        }
    }
}
