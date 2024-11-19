package pt.ua.deti.ies.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/{houseId}")
    public ResponseEntity<House> getHouseById(@PathVariable String houseId) {
        return houseService.getHouseById(houseId)
                .map(house -> ResponseEntity.ok(house))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }
}