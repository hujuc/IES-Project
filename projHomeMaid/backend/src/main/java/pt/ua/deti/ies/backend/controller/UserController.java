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
            // Validação da imagem
            if (profilePicture == null || profilePicture.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Profile picture is required."));
            }

            String encodedImage = Base64.getEncoder().encodeToString(profilePicture.getBytes());

            String hashedPassword = bCryptPasswordEncoder.encode(password);

            User user = new User(houseId, email, name, hashedPassword, encodedImage);

            userService.signUpUser(user);

            houseService.createHouseWithRoomsAndDevices(user.getHouseId());

            return ResponseEntity.ok(Map.of("message", "User successfully registered."));

        } catch (IllegalArgumentException e) {
            System.out.println("Validation Error: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserDto loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);

            return ResponseEntity.ok(Map.of(
                    "token", jwtToken,
                    "houseId", authenticatedUser.getHouseId(),
                    "username", authenticatedUser.getEmail()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error."));
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
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized.");
            }

            User authenticatedUser = (User) authentication.getPrincipal();

            if (!authenticatedUser.getHouseId().equals(houseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
            }

            User user = userService.getUserByHouseId(houseId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

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