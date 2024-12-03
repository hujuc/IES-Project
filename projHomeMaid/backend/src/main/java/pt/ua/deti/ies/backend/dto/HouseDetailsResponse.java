package pt.ua.deti.ies.backend.dto;

import pt.ua.deti.ies.backend.model.Room;

import java.util.List;

public class HouseDetailsResponse {

    private String houseId;
    private List<Room> rooms;
    private double temperature;
    private double humidity;

    // Construtor
    public HouseDetailsResponse(String houseId, List<Room> rooms, double temperature, double humidity) {
        this.houseId = houseId;
        this.rooms = rooms;
        this.temperature = temperature;
        this.humidity = humidity;
    }

    // Getters e Setters
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

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }
}
