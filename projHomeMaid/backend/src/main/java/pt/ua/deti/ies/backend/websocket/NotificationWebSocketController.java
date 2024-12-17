package pt.ua.deti.ies.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import pt.ua.deti.ies.backend.websocket.NotificationMessage;

@Controller
public class NotificationWebSocketController {

    @MessageMapping("/notification-update") // Recebe mensagens enviadas para "/app/notification-update"
    @SendTo("/topic/notifications") // Envia mensagens para todos inscritos em "/topic/notifications"
    public NotificationMessage handleNotificationUpdate(NotificationMessage message) {
        System.out.println("Received notification update: " + message);
        // Aqui, você pode realizar alguma lógica antes de enviar a mensagem para o cliente
        return message;
    }
}