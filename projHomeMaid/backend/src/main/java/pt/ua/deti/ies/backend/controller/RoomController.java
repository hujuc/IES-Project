package pt.ua.deti.ies.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.service.RoomService;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoomDetails(@PathVariable String roomId) {
        return roomService.getRoomById(roomId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{roomId}/devices")
    public ResponseEntity<List<String>> getDevicesByRoomId(@PathVariable String roomId) {
        return roomService.getRoomById(roomId)
                .map(room -> ResponseEntity.ok(room.getDevices()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        try {
            Room createdRoom = roomService.saveRoom(room);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating room.");
        }
    }


}