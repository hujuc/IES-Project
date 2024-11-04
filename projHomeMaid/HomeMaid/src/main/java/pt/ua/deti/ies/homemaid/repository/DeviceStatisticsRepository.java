package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.DeviceStatistics;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DeviceStatisticsRepository extends CassandraRepository<DeviceStatistics, String> {
    List<DeviceStatistics> findByHouseIdAndDateBetween(String houseId, LocalDate startDate, LocalDate endDate);
}
