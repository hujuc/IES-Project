package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email); // Check for duplicate email
    Optional<User> findByHouseId(String houseId);
}