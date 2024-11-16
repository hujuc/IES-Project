package pt.ua.deti.ies.homemaid.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.homemaid.model.Notification;
import pt.ua.deti.ies.homemaid.repository.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotificationsByUserName(String userName) {
        return notificationRepository.findByUserName(userName);
    }

    public void markAsRead(String notificationId, String userName) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserName().equals(userName)) {
            throw new RuntimeException("Unauthorized access to this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void deleteNotification(String notificationId, String userName) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserName().equals(userName)) {
            throw new RuntimeException("Unauthorized access to this notification");
        }

        notificationRepository.delete(notification);
    }

    public Notification createNotification(String userName, Notification notification) {
        notification.setUserName(userName);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }
}