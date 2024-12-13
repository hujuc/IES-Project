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
    private List<String> devices = new ArrayList<>(); // Inicializar como lista vazia
    private List<Device> deviceObjects = new ArrayList<>(); // Inicializar como lista vazia
    private String type;

    // Construtores
    public Room() {}

    public Room(String roomId, List<String> devices, String type) {
        this.roomId = roomId;
        this.devices = devices != null ? devices : new ArrayList<>(); // Garantir lista não-nula
        this.deviceObjects = new ArrayList<>(); // Inicializar como lista vazia
        this.type = type;
    }

    // Getters e Setters
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
        this.devices = devices != null ? devices : new ArrayList<>(); // Garantir lista não-nula
    }

    public List<Device> getDeviceObjects() {
        return deviceObjects;
    }

    public void setDeviceObjects(List<Device> deviceObjects) {
        this.deviceObjects = deviceObjects != null ? deviceObjects : new ArrayList<>(); // Garantir lista não-nula

        // Sincronizar a lista de IDs de dispositivos com `deviceObjects`
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
