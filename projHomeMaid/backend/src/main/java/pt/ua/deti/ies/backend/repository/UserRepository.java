package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}