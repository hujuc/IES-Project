package pt.ua.deti.ies.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.backend.model.Room;

public interface RoomRepository extends MongoRepository<Room, String> {
}