package pt.ua.deti.ies.backend.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import pt.ua.deti.ies.backend.model.User;
import pt.ua.deti.ies.backend.service.UserService;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.service.HouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.*;

@CrossOrigin(
        origins = {
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.DELETE,
                RequestMethod.POST,
                RequestMethod.PATCH
        })
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private HouseService houseService;

    public UserController(UserService userService, HouseService houseService) {
        this.userService = userService;
        this.houseService = houseService;
    }

    @PostMapping(value = "/signUp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> signUpUser(
            @RequestParam("houseId") String houseId,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("profilePicture") MultipartFile profilePicture) {
        try {
            // Converta o arquivo em base64 (ou salve em algum lugar)
            String encodedImage = Base64.getEncoder().encodeToString(profilePicture.getBytes());

            User user = new User(houseId, email, name, password, encodedImage);
            userService.signUpUser(user);

            House newHouse = houseService.createHouseWithRoomsAndDevices(user.getHouseId());

            return ResponseEntity.ok("User successfully registered.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            String houseId = userService.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok().body(Map.of("houseId", houseId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
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
            User user = userService.getUserByHouseId(houseId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
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