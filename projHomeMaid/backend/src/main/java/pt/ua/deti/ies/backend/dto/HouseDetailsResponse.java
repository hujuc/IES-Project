package pt.ua.deti.ies.backend.dto;

import pt.ua.deti.ies.backend.model.Room;

import java.util.List;

public class HouseDetailsResponse {

    private String houseId;
    private List<Room> rooms;

    public HouseDetailsResponse(String houseId, List<Room> rooms) {
        this.houseId = houseId;
        this.rooms = rooms;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}
