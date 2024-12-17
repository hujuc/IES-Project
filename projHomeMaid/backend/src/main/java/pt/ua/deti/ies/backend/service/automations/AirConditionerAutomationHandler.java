package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AirConditionerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public AirConditionerAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);

            if (state) {
                double temperature = changes.containsKey("temperature")
                        ? ((Number) changes.get("temperature")).doubleValue()
                        : device.getTemperature();

                String mode = changes.containsKey("mode")
                        ? (String) changes.get("mode")
                        : device.getMode();

                String airFluxDirection = changes.containsKey("airFluxDirection")
                        ? (String) changes.get("airFluxDirection")
                        : device.getAirFluxDirection();

                String airFluxRate = changes.containsKey("airFluxRate")
                        ? (String) changes.get("airFluxRate")
                        : device.getAirFluxRate();

                device.setTemperature(temperature);
                device.setMode(mode);
                device.setAirFluxDirection(airFluxDirection);
                device.setAirFluxRate(airFluxRate);

                System.out.println("Air Conditioner turned ON with:");
                System.out.println(" - Temperature: " + temperature + "°C");
                System.out.println(" - Mode: " + mode);
                System.out.println(" - Air Flux Direction: " + airFluxDirection);
                System.out.println(" - Air Flux Rate: " + airFluxRate);
            }

            deviceRepository.save(device);
        }
    }
}
