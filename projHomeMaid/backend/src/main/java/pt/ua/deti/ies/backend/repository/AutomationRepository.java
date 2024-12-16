package pt.ua.deti.ies.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ua.deti.ies.backend.model.Automation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface AutomationRepository extends MongoRepository<Automation, String> {
    List<Automation> findAllByExecutionTime(LocalTime executionTime);

    void deleteByDeviceIdAndExecutionTime(String deviceId, LocalTime executionTime);

    @Query("SELECT a FROM Automation a WHERE a.executionTime BETWEEN :startTime AND :endTime")
    List<Automation> findAllByExecutionTimeBetween(@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime);
}
