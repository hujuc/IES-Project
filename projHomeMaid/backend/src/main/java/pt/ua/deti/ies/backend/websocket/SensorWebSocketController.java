package pt.ua.deti.ies.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SensorWebSocketController {

    @MessageMapping("/sensor-update")
    @SendTo("/topic/sensor-updates")
    public SensorState handleSensorUpdate(SensorUpdateMessage message) {
        System.out.println("Received sensor update: " + message);
        return new SensorState(
                message.getRoomId(),
                message.getField().equals("temperature") ? message.getValue() : 0.0,
                message.getField().equals("humidity") ? message.getValue() : 0.0
        );
    }
}
