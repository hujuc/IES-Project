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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private HouseService houseService;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(BCryptPasswordEncoder bCryptPasswordEncoder, UserService userService, HouseService houseService, JwtService jwtService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.houseService = houseService;
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping(value = "/signUp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> signUpUser(
            @RequestParam("houseId") String houseId,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("profilePicture") MultipartFile profilePicture) {
        try {
            // Convert the uploaded file to Base64 format
            String encodedImage = Base64.getEncoder().encodeToString(profilePicture.getBytes());

            // Hash the password before saving
            String hashedPassword = bCryptPasswordEncoder.encode(password);

            // Create a new user object with the hashed password
            User user = new User(houseId, email, name, hashedPassword, encodedImage);

            // Save the user and initialize the house and rooms
            userService.signUpUser(user);
            houseService.createHouseWithRoomsAndDevices(user.getHouseId());

            return ResponseEntity.ok("User successfully registered.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
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

            // Return response with token and houseId only
            return ResponseEntity.ok(Map.of(
                    "token", jwtToken,
                    "houseId", houseId,
                    "username", authenticatedUser.getEmail(),
                    "passwordField", authenticatedUser.getPassword() // Changed key name for testing
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

    @PatchMapping("/{houseId}/editProfile")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable String houseId,
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "profilePic", required = false) MultipartFile file) {
        try {
            User updatedUser = userService.updateUserProfile(houseId, name, file);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user profile.");
        }
    }
}