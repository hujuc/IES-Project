package pt.ua.deti.ies.homemaid.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Mostrar todos os utilizadores", description = "Retorna uma lista de todos os utilizadores registados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de utilizadores retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(summary = "Pesquisa um utilizador por ID (userName)", description = "Retorna o utilizador especificado pelo userName.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilizador encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
    })    @GetMapping("/{userName}")
    public ResponseEntity<User> getUserById(@PathVariable String userName) {
        return userService.getUserById(userName)
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Criar um novo utilizador", description = "Cria um novo utilizador no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Utilizador criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @Operation(summary = "Atualizar um utilizador existente", description = "Atualiza as informações de um utilizador já registado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilizador atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Utilizador não encontrado"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PutMapping("/{userName}")
    public ResponseEntity<User> updateUser(@PathVariable String userName, @RequestBody User user) {
        if (!userService.getUserById(userName).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User updatedUser = userService.updateUser(userName, user);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Apagar um utilizador", description = "Remove um utilizador do sistema com base no userName.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilizador deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
    })
    @DeleteMapping("/{userName}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userName) {
        if (!userService.getUserById(userName).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        userService.deleteUser(userName);
        return ResponseEntity.noContent().build();
    }
}
