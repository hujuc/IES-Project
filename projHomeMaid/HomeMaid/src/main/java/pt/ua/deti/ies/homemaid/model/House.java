package pt.ua.deti.ies.homemaid.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "houses")
public class House {

    @Id
    private String id;
    private List<String> rooms;
    private List<String> devices;

    public House() {}

    public House(String id, List<String> rooms, List<String> devices) {
        this.id = id;
        this.rooms = rooms;
        this.devices = devices;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getRooms() {
        return rooms;
    }

    public void setRooms(List<String> rooms) {
        this.rooms = rooms;
    }

    public List<String> getDevices() {
        return devices;
    }

    public void setDevices(List<String> devices) {
        this.devices = devices;
    }

    @Override
    public String toString() {
        return "House{" +
                "id='" + id + '\'' +
                ", rooms=" + rooms +
                ", devices=" + devices +
                '}';
    }
}
