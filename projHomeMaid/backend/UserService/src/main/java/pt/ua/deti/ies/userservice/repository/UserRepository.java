package pt.ua.deti.ies.userservice.repository;

import pt.ua.deti.ies.userservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}