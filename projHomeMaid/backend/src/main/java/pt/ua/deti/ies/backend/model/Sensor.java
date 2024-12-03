package pt.ua.deti.ies.homemaid.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensors")
public class Sensor {
    @Id
    private String sensorId;
    private String name;
    private String type;  // Ex: "temperature", "humidity", etc.
    private Double value; // Valor da leitura
    private String unit;  // Ex: "°C", "%", "Pa", etc.
    private String houseId; // ID da casa para onde o sensor pertence

    // Construtores, getters e setters
    public Sensor(String sensorId, String name, String type, Double value, String unit, String houseId) {
        this.sensorId = sensorId;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.houseId = houseId;
    }

    public Sensor() {}

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    @Override
    public String toString() {
        return "Sensor{" +
                "sensorId='" + sensorId + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", value=" + value +
                ", unit='" + unit + '\'' +
                ", houseId='" + houseId + '\'' +
                '}';
    }
}
