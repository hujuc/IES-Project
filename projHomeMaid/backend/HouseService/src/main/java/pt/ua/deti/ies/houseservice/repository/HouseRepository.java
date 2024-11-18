package pt.ua.deti.ies.houseservice.repository;

import pt.ua.deti.ies.houseservice.model.House;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HouseRepository extends MongoRepository<House, String> {
}