package pt.ua.deti.ies.backend.repository;

public interface CustomSensorRepository {
    void updateSensorFields(String sensorId, String roomId, String houseId, String type, Double value, String unit, String name);
}
