package pt.ua.deti.ies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.service.SensorService;
import pt.ua.deti.ies.backend.model.Sensor;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @PostMapping
    public ResponseEntity<String> createSensor(@RequestBody Sensor sensor) {
        try {
            sensorService.saveSensor(sensor);
            return ResponseEntity.ok("Dados do sensor enviados para o InfluxDB!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar dados: " + e.getMessage());
        }
    }


    // Temperatura média por divisão
    @GetMapping("/rooms/{roomId}/average-temperature")
    public ResponseEntity<String> getAverageTemperatureByRoom(
            @PathVariable String roomId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageTemperature(roomId, "room", timeframe);
        return ResponseEntity.ok(result);
    }

    // Temperatura média por casa
    @GetMapping("/houses/{houseId}/average-temperature")
    public ResponseEntity<String> getAverageTemperatureByHouse(
            @PathVariable String houseId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageTemperature(houseId, "house", timeframe);
        return ResponseEntity.ok(result);
    }

    // Humidade média por divisão
    @GetMapping("/rooms/{roomId}/average-humidity")
    public ResponseEntity<String> getAverageHumidityByRoom(
            @PathVariable String roomId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageHumidity(roomId, "room", timeframe);
        return ResponseEntity.ok(result);
    }

    // Humidade média por casa
    @GetMapping("/houses/{houseId}/average-humidity")
    public ResponseEntity<String> getAverageHumidityByHouse(
            @PathVariable String houseId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageHumidity(houseId, "house", timeframe);
        return ResponseEntity.ok(result);
    }



    @GetMapping("/{sensorId}/data")
    public ResponseEntity<String> getSensor(@PathVariable String sensorId) {
        if (sensorId == null || sensorId.isEmpty()) {
            return ResponseEntity.badRequest().body("O ID do sensor é obrigatório.");
        }

        try {
            String result = sensorService.getSensor(sensorId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar dados do sensor: " + e.getMessage());
        }
    }


}
