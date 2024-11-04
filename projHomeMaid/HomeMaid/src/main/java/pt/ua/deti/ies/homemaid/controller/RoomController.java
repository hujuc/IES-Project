package pt.ua.deti.ies.homemaid.controller;

import pt.ua.deti.ies.homemaid.model.Room;
import pt.ua.deti.ies.homemaid.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Get room by ID
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<Room> getRoomById(@PathVariable String roomId) {
        return roomService.getRoomById(roomId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Update existing room
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable String roomId, @RequestBody Room roomDetails) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, roomDetails));
    }

    // List rooms by house ID
    @GetMapping("/houses/{houseId}/rooms")
    public List<Room> getRoomsByHouseId(@PathVariable String houseId) {
        return roomService.getRoomsByHouseId(houseId);
    }
}
