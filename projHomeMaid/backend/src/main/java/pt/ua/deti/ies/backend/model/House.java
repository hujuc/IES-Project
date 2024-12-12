package pt.ua.deti.ies.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "houses")
public class House {

    @Id
    private String houseId;
    private List<String> rooms;
    private List<String> devices;

    public House() {}

    public House(String houseId, List<String> rooms, List<String> devices) {
        this.houseId = houseId;
        this.rooms = rooms;
        this.devices = devices;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
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

    @java.lang.Override
    public java.lang.String toString() {
        return "House{" +
                "houseId='" + houseId + '\'' +
                ", rooms=" + rooms +
                ", devices=" + devices +
                '}';
    }
}
