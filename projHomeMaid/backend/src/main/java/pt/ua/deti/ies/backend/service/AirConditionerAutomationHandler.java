package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.websocket.DeviceWebSocketHandler;

import java.util.Map;

@Component
public class AirConditionerAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final DeviceWebSocketHandler webSocketHandler;

    public AirConditionerAutomationHandler(DeviceRepository deviceRepository, DeviceWebSocketHandler webSocketHandler) {
        this.deviceRepository = deviceRepository;
        this.webSocketHandler = webSocketHandler;
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
//            webSocketHandler.broadcast(new ObjectMapper().writeValueAsString(device));
        } else {
            System.out.println("No state provided for Air Conditioner automation.");
        }
    }
}
