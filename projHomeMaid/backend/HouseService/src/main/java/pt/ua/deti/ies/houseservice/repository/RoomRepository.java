package pt.ua.deti.ies.houseservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.houseservice.model.Room;

public interface RoomRepository extends MongoRepository<Room, String> {
}