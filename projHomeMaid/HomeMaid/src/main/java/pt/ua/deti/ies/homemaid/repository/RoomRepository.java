package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
}
