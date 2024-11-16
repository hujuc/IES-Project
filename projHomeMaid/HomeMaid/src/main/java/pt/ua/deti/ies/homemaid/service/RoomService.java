package pt.ua.deti.ies.homemaid.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.homemaid.model.Room;
import pt.ua.deti.ies.homemaid.repository.RoomRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Optional<Room> getRoomById(String roomId) {
        return roomRepository.findById(roomId);
    }
}