package pt.ua.deti.ies.backend.controller;

import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public Notification createNotification(
            @RequestParam String houseId,
            @RequestParam String text,
            @RequestParam String type
    ) {
        return notificationService.createNotification(houseId, text, type);
    }

    @GetMapping("/house/{houseId}")
    public List<Notification> getNotificationsByHouseId(@PathVariable String houseId) {
        return notificationService.getNotificationsByHouseId(houseId);
    }

    @PatchMapping("/read")
    public void markAsRead(@RequestBody Notification notification) {
        notificationService.markAsRead(notification);
    }

    @DeleteMapping
    public void deleteNotification(@RequestBody Notification notification) {
        notificationService.deleteNotification(notification);
    }

    @DeleteMapping("/house/{houseId}")
    public void deleteReadNotificationsByHouse(@PathVariable String houseId) {
        notificationService.deleteReadNotificationsByHouse(houseId);
    }
}
