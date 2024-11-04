package pt.ua.deti.ies.homemaid.service;

import pt.ua.deti.ies.homemaid.model.House;
import com.ua.deti.ies.repository.HouseRepository;
import org.springframework.stereotype.Service;

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
