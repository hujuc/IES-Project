package pt.ua.deti.ies.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import pt.ua.deti.ies.backend.dto.HouseDetailsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.service.HouseService;
import pt.ua.deti.ies.backend.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import pt.ua.deti.ies.backend.model.User;

import java.util.*;

@RestController
@RequestMapping("/api/houses")
public class HouseController {

    private final HouseService houseService;
    private final DeviceService deviceService;

    public HouseController(HouseService houseService, DeviceService deviceService) {
        this.houseService = houseService;
        this.deviceService = deviceService;
    }

    @GetMapping("/{houseId}")
    public ResponseEntity<?> getHouseDetails(@PathVariable String houseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized.");
            }

            User authenticatedUser = (User) authentication.getPrincipal();

            if (!houseService.userHasAccessToHouse(authenticatedUser, houseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
            }

            Optional<House> houseOptional = houseService.getHouseById(houseId);

            if (houseOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("House with ID " + houseId + " not found.");
            }

            House house = houseOptional.get();
            List<String> roomIds = house.getRooms();
            List<Room> rooms = houseService.getRoomsByIds(roomIds);

            for (Room room : rooms) {
                List<String> deviceIds = room.getDevices();
                List<Device> devices = deviceService.getDevicesByIds(deviceIds);
                room.setDeviceObjects(devices);
            }

            return ResponseEntity.ok(new HouseDetailsResponse(
                    house.getHouseId(),
                    rooms
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createHouse(@RequestBody @Valid House house) {
        try {
            House createdHouse = houseService.saveHouse(house);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHouse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the house: " + e.getMessage());
        }
    }
}
