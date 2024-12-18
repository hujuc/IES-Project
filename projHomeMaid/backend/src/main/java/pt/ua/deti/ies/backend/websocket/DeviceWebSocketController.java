package pt.ua.deti.ies.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DeviceWebSocketController {

    @MessageMapping("/update")
    @SendTo("/topic/device-updates")
    public DeviceState handleUpdate(DeviceUpdateMessage message) throws Exception {
        Thread.sleep(500);

        System.out.println("Atualizando dispositivo: " + message.getDeviceId());
        System.out.println("Campo: " + message.getField() + " | Valor: " + message.getValue());

        return new DeviceState(message.getDeviceId(), true, 50, 70);
    }
}
