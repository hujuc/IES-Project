package pt.ua.deti.ies.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Sensor;
import pt.ua.deti.ies.backend.repository.SensorRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SensorService {

    private final SensorRepository sensorRepository;

    @Autowired
    public SensorService(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    public Sensor createSensor(Sensor sensor) {
        return sensorRepository.save(sensor);
    }

    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    public List<Sensor> getSensorsByHouseId(String houseId) {
        return sensorRepository.findByHouseId(houseId);
    }

    public List<Sensor> getSensorsByType(String type) {
        return sensorRepository.findByType(type);
    }

    public Optional<Sensor> getSensorById(String sensorId) {
        return sensorRepository.findById(sensorId);
    }

    public Sensor updateSensor(String sensorId, Sensor updatedSensor) {
        updatedSensor.setSensorId(sensorId);
        return sensorRepository.save(updatedSensor);
    }

    public void deleteSensor(String sensorId) {
        sensorRepository.deleteById(sensorId);
    }
}
