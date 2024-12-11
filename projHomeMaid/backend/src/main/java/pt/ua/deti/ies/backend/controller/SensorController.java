package pt.ua.deti.ies.backend.controller;

import pt.ua.deti.ies.backend.model.Sensor;
import pt.ua.deti.ies.backend.service.SensorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    // Criar Sensor
    @PostMapping
    public ResponseEntity<Sensor> createSensor(@RequestBody Sensor sensor) {
        Sensor createdSensor = sensorService.createSensor(sensor);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSensor);
    }

    // Listar todos os Sensores
    @GetMapping
    public ResponseEntity<List<Sensor>> getAllSensors() {
        return ResponseEntity.ok(sensorService.getAllSensors());
    }

    // Listar Sensores por ID da Casa
    @GetMapping("/houses/{houseId}/sensors")
    public ResponseEntity<List<Sensor>> getSensorsByHouseId(@PathVariable String houseId) {
        List<Sensor> sensors = sensorService.getSensorsByHouseId(houseId);
        return ResponseEntity.ok(sensors);
    }

    // Buscar Sensor por ID
    @GetMapping("/{sensorId}")
    public ResponseEntity<Sensor> getSensorById(@PathVariable String sensorId) {
        Optional<Sensor> sensor = sensorService.getSensorById(sensorId);
        return sensor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Atualizar Sensor
    @PutMapping("/{sensorId}")
    public ResponseEntity<Sensor> updateSensor(@PathVariable String sensorId, @RequestBody Sensor updatedSensor) {
        Sensor sensor = sensorService.updateSensor(sensorId, updatedSensor);
        return ResponseEntity.ok(sensor);
    }

    // Deletar Sensor
    @DeleteMapping("/{sensorId}")
    public ResponseEntity<Void> deleteSensor(@PathVariable String sensorId) {
        sensorService.deleteSensor(sensorId);
        return ResponseEntity.noContent().build();
    }
}
