package pt.ua.deti.ies.backend.websocket;

public class SensorState {
    private String roomId;
    private double temperature;
    private double humidity;

    public SensorState(String roomId, double temperature, double humidity) {
        this.roomId = roomId;
        this.temperature = temperature;
        this.humidity = humidity;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
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
