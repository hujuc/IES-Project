package pt.ua.deti.ies.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;

@Controller
public class NotificationWebSocketController {

    @MessageMapping("/notification-update")
    @SendTo("/topic/notifications")
    public NotificationMessage handleNotificationUpdate(NotificationMessage message) {
        System.out.println("Received notification update: " + message);
        return message;
    }
}