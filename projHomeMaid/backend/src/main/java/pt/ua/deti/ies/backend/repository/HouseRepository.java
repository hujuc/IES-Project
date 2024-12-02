package pt.ua.deti.ies.backend.repository;

import pt.ua.deti.ies.backend.model.House;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HouseRepository extends MongoRepository<House, String> {
}