package pt.ua.deti.ies.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.backend.model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByHouseId(String houseId);
    List<Notification> findByHouseIdAndRead(String houseId, boolean read);
}
