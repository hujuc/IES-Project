package pt.ua.deti.ies.notificationservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.notificationservice.model.Notification;
import pt.ua.deti.ies.notificationservice.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/users/{username}/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@PathVariable("username") String username, @RequestBody Notification notification) {
        Notification createdNotification = notificationService.createNotification(username, notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
    }

    @GetMapping
    public List<Notification> getUserNotifications(@PathVariable("username") String username) {
        return notificationService.getNotificationsByUserName(username);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable("username") String username, @PathVariable String notificationId) {
        notificationService.markAsRead(notificationId, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("username") String username, @PathVariable String notificationId) {
        notificationService.deleteNotification(notificationId, username);
        return ResponseEntity.noContent().build();
    }
}