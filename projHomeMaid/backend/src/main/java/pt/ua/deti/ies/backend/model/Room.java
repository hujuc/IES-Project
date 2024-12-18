package pt.ua.deti.ies.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Document(collection = "rooms")
public class Room {

    @Id
    private String roomId;
    private List<String> devices = new ArrayList<>();
    private List<Device> deviceObjects = new ArrayList<>();
    private String type;

    public Room() {}

    public Room(String roomId, List<String> devices, String type) {
        this.roomId = roomId;
        this.devices = devices != null ? devices : new ArrayList<>();
        this.deviceObjects = new ArrayList<>();
        this.type = type;
    }

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
        this.devices = devices != null ? devices : new ArrayList<>();
    }

    public List<Device> getDeviceObjects() {
        return deviceObjects;
    }

    public void setDeviceObjects(List<Device> deviceObjects) {
        this.deviceObjects = deviceObjects != null ? deviceObjects : new ArrayList<>();

        this.devices = this.deviceObjects.stream()
                .map(Device::getDeviceId)
                .collect(Collectors.toList());
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Room{" +
                "roomId='" + roomId + '\'' +
                ", devices=" + devices +
                ", deviceObjects=" + deviceObjects +
                ", type='" + type + '\'' +
                '}';
    }
}
