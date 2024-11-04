package pt.ua.deti.ies.homemaid.service;

import pt.ua.deti.ies.homemaid.model.User;
import pt.ua.deti.ies.homemaid.repository.UserRepository;;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(String userName) {
        return userRepository.findById(userName);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(String userName, User updatedUser) {
        updatedUser.setUserName(userName); // garante que o ID está correto
        return userRepository.save(updatedUser);
    }

    public void deleteUser(String userName) {
        userRepository.deleteById(userName);
    }
}