package pt.ua.deti.ies.backend.service;

import org.apache.commons.codec.digest.DigestUtils;
import pt.ua.deti.ies.backend.model.User;
import pt.ua.deti.ies.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import java.util.Base64;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;
import java.io.IOException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private static final String SECRET_KEY = "!a04h09r07r18!";

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> allUsers(){
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

    public User signUpUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        if (userRepository.findByHouseId(user.getHouseId()).isPresent()) {
            throw new IllegalArgumentException("House ID is already in use.");
        }

        user.setPassword(user.getPassword());
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

        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password.");
        }

        return user.getHouseId();
    }


    public User updateUserProfile(String houseId, String name, MultipartFile file) {
        Optional<User> userOpt = userRepository.findByHouseId(houseId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        User user = userOpt.get();

        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }

        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                user.setProfilePicture(base64Image);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update profile picture.", e);
            }
        }

        return userRepository.save(user);
    }



}