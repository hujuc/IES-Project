package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class AirConditionerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public AirConditionerAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("state")) {
            boolean state = (boolean) changes.get("state");
            device.setState(state);

            if (state) {
                // Configurações adicionais para ligar o ar-condicionado
                double temperature = changes.containsKey("temperature")
                        ? ((Number) changes.get("temperature")).doubleValue()
                        : device.getTemperature(); // Usa a temperatura atual, se não especificada

                String mode = changes.containsKey("mode")
                        ? (String) changes.get("mode")
                        : device.getMode(); // Usa o modo atual, se não especificado

                String airFluxDirection = changes.containsKey("airFluxDirection")
                        ? (String) changes.get("airFluxDirection")
                        : device.getAirFluxDirection(); // Usa a direção atual, se não especificada

                String airFluxRate = changes.containsKey("airFluxRate")
                        ? (String) changes.get("airFluxRate")
                        : device.getAirFluxRate(); // Usa a taxa atual, se não especificada

                // Atualiza os valores no dispositivo
                device.setTemperature(temperature);
                device.setMode(mode);
                device.setAirFluxDirection(airFluxDirection);
                device.setAirFluxRate(airFluxRate);

                System.out.println("Air Conditioner turned ON with:");
                System.out.println(" - Temperature: " + temperature + "°C");
                System.out.println(" - Mode: " + mode);
                System.out.println(" - Air Flux Direction: " + airFluxDirection);
                System.out.println(" - Air Flux Rate: " + airFluxRate);
            } else {
                // Desliga o ar-condicionado
                System.out.println("Air Conditioner turned OFF.");
            }

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
            System.out.println("No state provided for Air Conditioner automation.");
        }
    }
}
