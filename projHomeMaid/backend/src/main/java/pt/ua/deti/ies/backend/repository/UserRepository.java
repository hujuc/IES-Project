package pt.ua.deti.ies.backend.repository;

import pt.ua.deti.ies.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByHouseId(String houseId);
}