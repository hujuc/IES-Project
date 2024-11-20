package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.repository.RoomRepository;

import java.io.IOException;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final ImageStorageService imageStorageService; // Adicionado o serviço de armazenamento de imagens

    public RoomService(RoomRepository roomRepository, ImageStorageService imageStorageService) {
        this.roomRepository = roomRepository;
        this.imageStorageService = imageStorageService;
    }

    public Optional<Room> getRoomById(String roomId) {
        return roomRepository.findById(roomId);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public String updateRoomImage(String roomId, MultipartFile image) throws IOException {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        String imageUrl = imageStorageService.saveImage(image); // Salva a imagem e retorna a URL
        room.setImageUrl(imageUrl);
        roomRepository.save(room);
        return imageUrl;
    }
}
