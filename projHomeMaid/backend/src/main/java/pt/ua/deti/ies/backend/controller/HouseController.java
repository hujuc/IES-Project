package pt.ua.deti.ies.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Autowired;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.service.HouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/houses")
public class HouseController {

    private final HouseService houseService;

    public HouseController(HouseService houseService) {
        this.houseService = houseService;
    }

    // Buscar detalhes da casa pelo ID
    @GetMapping("/{houseId}")
    public ResponseEntity<?> getHouseDetails(@PathVariable String houseId) {
        Optional<House> houseOptional = houseService.getHouseById(houseId);

        if (houseOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("House with ID " + houseId + " not found.");
        }

        House house = houseOptional.get();

        // Buscar informações completas das salas associadas
        List<String> roomIds = house.getRooms();
        List<Room> rooms = houseService.getRoomsByIds(roomIds);

        // Retornar uma resposta enriquecida
        return ResponseEntity.ok(new HouseDetailsResponse(house, rooms));
    }

    // Criar uma nova casa
    @PostMapping
    public ResponseEntity<?> createHouse(@RequestBody @Valid House house) {
        try {
            // Salvar a casa
            House createdHouse = houseService.saveHouse(house);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHouse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the house: " + e.getMessage());
        }
    }

    // Classe auxiliar para estruturar a resposta
    public static class HouseDetailsResponse {
        private String houseId;
        private List<Room> rooms;
        private List<String> devices;
        private String imageUrl;

        public HouseDetailsResponse(House house, List<Room> rooms) {
            this.houseId = house.getHouseId();
            this.rooms = rooms;
            this.devices = house.getDevices();
            this.imageUrl = house.getImageUrl();
        }

        // Getters e setters
        public String getHouseId() {
            return houseId;
        }

        public void setHouseId(String houseId) {
            this.houseId = houseId;
        }

        public List<Room> getRooms() {
            return rooms;
        }

        public void setRooms(List<Room> rooms) {
            this.rooms = rooms;
        }

        public List<String> getDevices() {
            return devices;
        }

        public void setDevices(List<String> devices) {
            this.devices = devices;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }

    @PutMapping("/{houseId}/updateImage")
    public ResponseEntity<?> updateHouseImage(@PathVariable String houseId, @RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = houseService.updateHouseImage(houseId, image);
            return ResponseEntity.ok().body(imageUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save image");
        }
    }

}
