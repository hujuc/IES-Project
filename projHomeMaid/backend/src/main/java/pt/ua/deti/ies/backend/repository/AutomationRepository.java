package pt.ua.deti.ies.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.backend.model.Automation;

import java.time.LocalTime;
import java.util.List;

public interface AutomationRepository extends MongoRepository<Automation, String> {
    List<Automation> findAllByExecutionTime(LocalTime executionTime);

    void deleteByDeviceIdAndExecutionTime(String deviceId, LocalTime executionTime);
}
