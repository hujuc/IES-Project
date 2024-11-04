package pt.ua.deti.ies.homemaid.service;

import pt.ua.deti.ies.homemaid.model.Room;
import pt.ua.deti.ies.homemaid.repository.RoomRepository;
import pt.ua.deti.ies.homemaid.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HouseRepository houseRepository;

    public RoomService(RoomRepository roomRepository, HouseRepository houseRepository) {
        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
    }

    public Optional<Room> getRoomById(String roomId) {
        return roomRepository.findById(roomId);
    }

    public Room updateRoom(String roomId, Room roomDetails) {
        roomDetails.setRoomId(roomId); // Ensure roomId consistency
        return roomRepository.save(roomDetails);
    }

    public List<Room> getRoomsByHouseId(String houseId) {
        return houseRepository.findById(houseId)
                .map(house -> roomRepository.findAllById(house.getRooms())) // Fetch rooms based on IDs stored in House
                .orElseThrow(() -> new RuntimeException("House not found"));
    }
}
