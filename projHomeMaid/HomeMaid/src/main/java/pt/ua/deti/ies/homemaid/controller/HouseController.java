package pt.ua.deti.ies.homemaid.controller;

import pt.ua.deti.ies.homemaid.dto.HouseStatisticsResponse;
import pt.ua.deti.ies.homemaid.service.HouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/houses")
public class HouseController {
    private static final Logger logger = LoggerFactory.getLogger(HouseController.class);
    private final HouseService houseService;

    public HouseController(HouseService houseService) {
        this.houseService = houseService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseStatisticsResponse> getHouseById(@PathVariable String id) {
        logger.info("Received request for house ID: {}", id); // Log entry
        return houseService.getHouseStatistics(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
