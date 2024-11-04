package pt.ua.deti.ies.homemaid.controller;

import pt.ua.deti.ies.homemaid.model.User;
import pt.ua.deti.ies.homemaid.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Buscar todos os usuários
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Buscar usuário por ID (userName)
    @GetMapping("/{userName}")
    public ResponseEntity<User> getUserById(@PathVariable String userName) {
        return userService.getUserById(userName)
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Criar um novo usuário
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Atualizar um usuário existente
    @PutMapping("/{userName}")
    public ResponseEntity<User> updateUser(@PathVariable String userName, @RequestBody User user) {
        if (!userService.getUserById(userName).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User updatedUser = userService.updateUser(userName, user);
        return ResponseEntity.ok(updatedUser);
    }

    // Deletar um usuário
    @DeleteMapping("/{userName}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userName) {
        if (!userService.getUserById(userName).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        userService.deleteUser(userName);
        return ResponseEntity.noContent().build();
    }
}
