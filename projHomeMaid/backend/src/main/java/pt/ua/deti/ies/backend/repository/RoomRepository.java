package pt.ua.deti.ies.homemaid.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.homemaid.model.Room;

public interface RoomRepository extends MongoRepository<Room, String> {
}