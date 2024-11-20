package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.repository.HouseRepository;
import pt.ua.deti.ies.backend.repository.RoomRepository;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HouseService {

    private final HouseRepository houseRepository;
    private final RoomRepository roomRepository;
    private final ImageStorageService imageStorageService;

    public HouseService(HouseRepository houseRepository, RoomRepository roomRepository, ImageStorageService imageStorageService) {
        this.houseRepository = houseRepository;
        this.roomRepository = roomRepository;
        this.imageStorageService = imageStorageService;
    }

    public Optional<House> getHouseById(String id) {
        return houseRepository.findById(id);
    }

    public List<Room> getRoomsByIds(List<String> roomIds) {
        return roomRepository.findAllById(roomIds);
    }

    public House saveHouse(House house) {
        return houseRepository.save(house);
    }

    public String updateHouseImage(String houseId, MultipartFile image) throws IOException {
        House house = houseRepository.findById(houseId).orElseThrow(() -> new IllegalArgumentException("House not found"));
        String imageUrl = imageStorageService.saveImage(image); // Salva a imagem e retorna a URL
        house.setImageUrl(imageUrl);
        houseRepository.save(house);
        return imageUrl;
    }

}
