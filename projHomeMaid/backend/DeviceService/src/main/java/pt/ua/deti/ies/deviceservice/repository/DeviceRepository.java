package pt.ua.deti.ies.deviceservice.repository;

import pt.ua.deti.ies.deviceservice.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeviceRepository extends MongoRepository<Device, String> {
}