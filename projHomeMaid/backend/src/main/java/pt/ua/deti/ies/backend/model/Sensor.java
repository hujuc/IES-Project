package pt.ua.deti.ies.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensors")
public class Sensor {

    private String sensorId; // ID único do sensor
    private String roomId;   // ID do quarto ao qual o sensor pertence
    private String houseId;  // ID da casa à qual o sensor pertence
    private String type;     // Tipo do sensor: "temperature", "humidity", etc.
    private Double value;    // Valor lido pelo sensor
    private String unit;     // Unidade da leitura: "°C", "%", etc.
    private String name;     // Nome descritivo do sensor

    // Construtores
    public Sensor(String sensorId, String roomId, String houseId, String type, Double value, String unit, String name) {
        this.sensorId = sensorId;
        this.roomId = roomId;
        this.houseId = houseId;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.name = name;
    }

    public Sensor() {}

    // Getters e Setters
    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Sensor{" +
                "sensorId='" + sensorId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", houseId='" + houseId + '\'' +
                ", type='" + type + '\'' +
                ", value=" + value +
                ", unit='" + unit + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
