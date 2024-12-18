package pt.ua.deti.ies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.service.SensorService;
import pt.ua.deti.ies.backend.model.Sensor;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;

@CrossOrigin(
        origins = {
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.POST
        })
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

    @GetMapping
    public ResponseEntity<?> getAllSensors() {
        try {
            List<Sensor> sensors = sensorService.getAllSensors();
            if (sensors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Nenhum sensor encontrado.");
            }
            return ResponseEntity.ok(sensors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar sensores: " + e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}/average-temperature")
    public ResponseEntity<String> getAverageTemperatureByRoom(
            @PathVariable String roomId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageTemperature(roomId, "room", timeframe);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/houses/{houseId}/average-temperature")
    public ResponseEntity<String> getAverageTemperatureByHouse(
            @PathVariable String houseId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageTemperature(houseId, "house", timeframe);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rooms/{roomId}/average-humidity")
    public ResponseEntity<String> getAverageHumidityByRoom(
            @PathVariable String roomId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        String result = sensorService.getAverageHumidity(roomId, "room", timeframe);
        return ResponseEntity.ok(result);
    }

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

    @GetMapping("/rooms/{roomId}/latest")
    public ResponseEntity<Map<String, Double>> getLatestMeasurementsByRoom(@PathVariable String roomId) {
        try {
            double temperature = sensorService.getLatestMeasurementAsDouble(roomId, "room", "temperature");
            double humidity = sensorService.getLatestMeasurementAsDouble(roomId, "room", "humidity");
            Map<String, Double> result = new HashMap<>();
            result.put("temperature", temperature);
            result.put("humidity", humidity);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", Double.NaN));
        }
    }

    @GetMapping("/rooms/{roomId}/data")
    public ResponseEntity<List<Map<String, Object>>> getRoomGraphData(
            @PathVariable String roomId,
            @RequestParam(value = "timeframe", defaultValue = "daily") String timeframe
    ) {
        try {
            List<Map<String, Object>> data = sensorService.getRoomGraphData(roomId, timeframe);
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException e) {
            System.err.println("Erro de validação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.emptyList());
        } catch (Exception e) {
            System.err.println("Erro interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }








}
