package pt.ua.deti.ies.homemaid.controller;

import pt.ua.deti.ies.homemaid.model.House;
import pt.ua.deti.ies.homemaid.service.HouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/houses")
public class HouseController {
    private final HouseService houseService;

    public HouseController(HouseService houseService) {
        this.houseService = houseService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<House> getHouseById(@PathVariable String id) {
        return houseService.getHouseById(id)
                .map(house -> ResponseEntity.ok(house))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
