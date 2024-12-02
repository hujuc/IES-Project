package pt.ua.deti.ies.backend.repository;

import pt.ua.deti.ies.backend.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeviceRepository extends MongoRepository<Device, String> {
}