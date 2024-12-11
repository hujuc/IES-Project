package pt.ua.deti.ies.backend.repository;

import pt.ua.deti.ies.backend.model.Sensor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorRepository extends MongoRepository<Sensor, String> {
    List<Sensor> findByHouseId(String houseId);  // Encontrar sensores de uma casa específica
    List<Sensor> findByType(String type);        // Encontrar sensores por tipo (ex: temperatura, umidade)
}
