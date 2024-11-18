package pt.ua.deti.ies.houseservice.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.houseservice.model.House;
import pt.ua.deti.ies.houseservice.repository.HouseRepository;

import java.util.Optional;

@Service
public class HouseService {

    private final HouseRepository houseRepository;

    public HouseService(HouseRepository houseRepository) {
        this.houseRepository = houseRepository;
    }

    public Optional<House> getHouseById(String id) {
        return houseRepository.findById(id);
    }
}