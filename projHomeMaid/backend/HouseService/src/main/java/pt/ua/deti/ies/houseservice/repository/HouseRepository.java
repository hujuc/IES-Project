package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.House;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HouseRepository extends MongoRepository<House, String> {
}