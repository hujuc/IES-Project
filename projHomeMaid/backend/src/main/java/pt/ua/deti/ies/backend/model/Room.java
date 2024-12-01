package pt.ua.deti.ies.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.stream.Collectors;

import java.util.List;

@Document(collection = "rooms")
public class Room {
    @Id
    private String roomId;
    private List<String> devices;
    private List<Device> deviceObjects; // Lista dos dispositivos completos
    private Double temperature;
    private Double humidity;
    private String type;

    public Room() {}

    public Room(String roomId, List<String> devices, Double temperature, Double humidity, String type) {
        this.roomId = roomId;
        this.devices = devices;
        this.temperature = temperature;
        this.humidity = humidity;
        this.type = type;
    }

    // Getters and setters
    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public List<String> getDevices() {
        return devices;
    }

    public void setDevices(List<String> devices) {
        this.devices = devices;
    }

    // Este método agora recebe uma lista de objetos Device
    public void setDeviceObjects(List<Device> devices) {
        this.deviceObjects = devices;

        // Se você quiser, ainda pode manter os IDs em devices
        this.devices = devices.stream()
                .map(Device::getDeviceId) // Supondo que Device tem o método getDeviceId
                .collect(Collectors.toList());
    }

    public List<Device> getDeviceObjects() {
        return deviceObjects;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Room{" +
                "roomId='" + roomId + '\'' +
                ", devices=" + devices +
                ", temperature=" + temperature +
                ", humidity=" + humidity +
                ", type='" + type + '\'' +
                '}';
    }
}
