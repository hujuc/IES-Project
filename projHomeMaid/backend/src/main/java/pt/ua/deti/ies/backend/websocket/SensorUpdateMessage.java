package pt.ua.deti.ies.backend.websocket;

public class SensorUpdateMessage {
    private String roomId;
    private String field;
    private double value;

    public SensorUpdateMessage(String roomId, String field, double value) {
        this.roomId = roomId;
        this.field = field;
        this.value = value;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
