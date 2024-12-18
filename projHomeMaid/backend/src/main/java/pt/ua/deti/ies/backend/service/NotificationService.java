package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Notification;
import pt.ua.deti.ies.backend.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String houseId, String text, String type) {
        Notification notification = new Notification(
                houseId,
                text,
                LocalDateTime.now(),
                false,
                type
        );
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByHouseId(String houseId) {
        return notificationRepository.findByHouseId(houseId);
    }

    public void markAsRead(Notification notification) {
        Notification existingNotification = notificationRepository.findById(notification.getMongoId())
                .orElseThrow(() -> new RuntimeException("[ERROR] Notification not found."));
        existingNotification.setRead(true);
        notificationRepository.save(existingNotification);
    }

    public void deleteNotification(Notification notification) {
        notificationRepository.findById(notification.getMongoId())
                .ifPresent(notificationRepository::delete);
    }

    public void deleteReadNotificationsByHouse(String houseId) {
        List<Notification> readNotifications = notificationRepository.findByHouseIdAndRead(houseId, true);
        notificationRepository.deleteAll(readNotifications);
    }
}
