package pt.ua.deti.ies.backend.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import pt.ua.deti.ies.backend.service.UserService;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.service.HouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import pt.ua.deti.ies.backend.model.User;
import pt.ua.deti.ies.backend.dto.LoginUserDto;
import pt.ua.deti.ies.backend.dto.RegisterUserDto;
import pt.ua.deti.ies.backend.responses.LoginResponse;
import pt.ua.deti.ies.backend.service.AuthenticationService;
import pt.ua.deti.ies.backend.service.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.*;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private HouseService houseService;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public UserController(UserService userService, HouseService houseService, JwtService jwtService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.houseService = houseService;
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> signUpUser(@RequestBody RegisterUserDto registerUserDto) {
        try {
            User registeredUser = authenticationService.signup(registerUserDto);

            House newHouse = houseService.createHouseWithRoomsAndDevices(registeredUser.getHouseId());

            return ResponseEntity.ok("User successfully registered." + registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserDto loginUserDto) {
        try {
            // Authenticate the user
            User authenticatedUser = authenticationService.authenticate(loginUserDto);

            // Generate JWT token
            String jwtToken = jwtService.generateToken(authenticatedUser);

            // Create response object
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());

            // Retrieve houseId
            String houseId = userService.loginUser(authenticatedUser.getEmail(), authenticatedUser.getPassword());

            // Return response with loginResponse and houseId
            return ResponseEntity.ok(Map.of(
                    "loginResponse", loginResponse,
                    "houseId", houseId
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error."));
        }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
        }
    }

    @DeleteMapping("/{houseId}")
    public ResponseEntity<?> deleteUserByHouseId(@PathVariable String houseId) {
        try {
            userService.deleteUserByHouseId(houseId);
            return ResponseEntity.ok("User successfully deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
        }
    }

    @GetMapping("/{houseId}")
    public ResponseEntity<?> getUserByHouseId(@PathVariable String houseId) {
        try {
            // Get the authenticated user from the security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Ensure the user is authenticated
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized.");
            }

            // Retrieve the authenticated user details
            User authenticatedUser = (User) authentication.getPrincipal();

            // Optional: Add authorization logic to ensure user has permission to access this houseId
            if (!authenticatedUser.getHouseId().equals(houseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
            }

            // Fetch the user by houseId from the service
            User user = userService.getUserByHouseId(houseId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            // Return the user information
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error.");
        }
    }


    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers(){
        List<User> users = userService.allUsers();

        return ResponseEntity.ok(users);
    }

}