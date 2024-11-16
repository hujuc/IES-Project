package pt.ua.deti.ies.homemaid.repository;

import pt.ua.deti.ies.homemaid.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeviceRepository extends MongoRepository<Device, String> {
}