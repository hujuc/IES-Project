package pt.ua.deti.ies.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import pt.ua.deti.ies.backend.websocket.DeviceWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final DeviceWebSocketHandler deviceWebSocketHandler;

    public WebSocketConfig(DeviceWebSocketHandler deviceWebSocketHandler) {
        this.deviceWebSocketHandler = deviceWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(deviceWebSocketHandler, "/ws/devices")
                .setAllowedOrigins("*"); // Permite qualquer origem (melhor restringir em produção)
    }
}
