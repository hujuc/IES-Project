package pt.ua.deti.ies.homemaid.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.homemaid.model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserName(String userName);
}
