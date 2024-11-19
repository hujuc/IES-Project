package pt.ua.deti.ies.homemaid.service;

import org.apache.commons.codec.digest.DigestUtils; // Ensure this import is present
import pt.ua.deti.ies.homemaid.model.User;
import pt.ua.deti.ies.homemaid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User signUpUser(User user) {
        // Check if email is already in use
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // Check if houseId is already in use
        if (userRepository.findByHouseId(user.getHouseId()).isPresent()) {
            throw new IllegalArgumentException("House ID is already in use.");
        }

        // Encrypt the password with SHA-256
        String encryptedPassword = DigestUtils.sha256Hex(user.getPassword());
        user.setPassword(encryptedPassword);

        // Save the user in the database
        return userRepository.save(user);
    }
}