package pt.ua.deti.ies.backend.service;

import org.apache.commons.codec.digest.DigestUtils; // Ensure this import is present
import pt.ua.deti.ies.backend.model.User;
import pt.ua.deti.ies.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Base64;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;
import java.io.IOException;

@Service
public class UserService {
    private final UserRepository userRepository;

    private static final String SECRET_KEY = "!a04h09r07r18!";

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User signUpUser(User user) {
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

    public void deleteUserByHouseId(String houseId) {
        Optional<User> userOpt = userRepository.findByHouseId(houseId);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User with the given houseId does not exist.");
        }

        userRepository.delete(userOpt.get());
    }

    public User getUserByHouseId(String houseId) {
        return userRepository.findByHouseId(houseId).orElse(null);
    }

    public String loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid email.");
        }

        User user = userOptional.get();

        String encryptedPassword = DigestUtils.sha256Hex(password);
        if (!user.getPassword().equals(encryptedPassword)) {
            throw new IllegalArgumentException("Incorrect password.");
        }

        return user.getHouseId();
    }

    public User updateUserProfile(String houseId, String name, MultipartFile file) {
        // Busca o usuário pelo houseId
        Optional<User> userOpt = userRepository.findByHouseId(houseId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        User user = userOpt.get();

        // Atualiza o nome, se fornecido
        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }

        // Atualiza a imagem de perfil, se fornecida
        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                user.setProfilePicture(base64Image);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update profile picture.", e);
            }
        }

        // Salva o usuário atualizado no MongoDB
        return userRepository.save(user);
    }



}