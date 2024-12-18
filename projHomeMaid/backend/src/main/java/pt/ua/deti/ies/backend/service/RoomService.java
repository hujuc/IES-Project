package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.repository.RoomRepository;

import java.io.IOException;
import java.util.*;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Optional<Room> getRoomById(String roomId) {
        return roomRepository.findById(roomId);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room addDeviceToRoom(String roomId, String deviceId) {
        return roomRepository.findById(roomId).map(room -> {
            List<String> devices = room.getDevices();
            devices.add(deviceId);
            room.setDevices(devices);
            return roomRepository.save(room);
        }).orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
    }

}
