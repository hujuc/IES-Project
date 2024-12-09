package pt.ua.deti.ies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.ua.deti.ies.backend.service.SensorService;
import pt.ua.deti.ies.backend.model.Sensor;
import org.springframework.http.HttpStatus;

@CrossOrigin(
        origins = {
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.DELETE,
                RequestMethod.POST,
                RequestMethod.PATCH
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


    @GetMapping("/rooms/{roomId}/average-temperature")
    public ResponseEntity<String> getAverageTemperature(@PathVariable String roomId) {
        String result = sensorService.getAverageTemperature(roomId);
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

    @GetMapping("/rooms/{roomId}/temperature-range")
    public ResponseEntity<String> getTemperatureRange(@PathVariable String roomId) {
        String result = sensorService.getTemperatureRange(roomId);
        return ResponseEntity.ok(result);
    }
}
