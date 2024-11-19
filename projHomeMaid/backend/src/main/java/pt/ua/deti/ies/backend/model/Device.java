package pt.ua.deti.ies.homemaid.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "devices")
public class Device {
    @Id
    private String deviceId;
    private String name;
    private String type;
    private Boolean state;
    private Integer brightness;
    private String color;
    private Integer openPercentage;
    private Integer volume;
    private Double temperature;
    private String mode;
    private Boolean ringing;
    private String airFluxDirection;
    private Integer airFluxRate;
    private String alarmSong;
    private String coffeeType;
    private Float cycleTime;
    private String dryingMode;
    private String washingMode;
    private Integer waterPercentage;
    private Integer conditionerPercentage;
    private Integer detergentPercentage;
    private Integer shuttersPercentage;
    private String airType

    // Constructor with all parameters
    public Device(String deviceId, String name, String type, Boolean state, Integer brightness, String color,
                  Integer openPercentage, Integer volume, Double temperature, String mode, Boolean ringing,
                  String airFluxDirection, Integer airFluxRate, String alarmSong, String coffeeType, Float cycleTime,
                  String dryingMode, String washingMode, Integer waterPercentage, Integer conditionerPercentage,
                  Integer detergentPercentage, Integer shuttersPercentage, String airType) {
        this.deviceId = deviceId;
        this.name = name;
        this.type = type;
        this.state = state;
        this.brightness = brightness;
        this.color = color;
        this.openPercentage = openPercentage;
        this.volume = volume;
        this.temperature = temperature;
        this.mode = mode;
        this.ringing = ringing;
        this.airFluxDirection = airFluxDirection;
        this.airFluxRate = airFluxRate;
        this.alarmSong = alarmSong;
        this.coffeeType = coffeeType;
        this.cycleTime = cycleTime;
        this.dryingMode = dryingMode;
        this.washingMode = washingMode;
        this.waterPercentage = waterPercentage;
        this.conditionerPercentage = conditionerPercentage;
        this.detergentPercentage = detergentPercentage;
        this.shuttersPercentage = shuttersPercentage;
        this.airType = airType;
    }

    // Default constructor
    public Device() {}

    // Getters and Setters
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
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

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public Integer getBrightness() {
        return brightness;
    }

    public void setBrightness(Integer brightness) {
        this.brightness = brightness;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getOpenPercentage() {
        return openPercentage;
    }

    public void setOpenPercentage(Integer openPercentage) {
        this.openPercentage = openPercentage;
    }

    public Integer getVolume() {
        return volume;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Boolean getRinging() {
        return ringing;
    }

    public void setRinging(Boolean ringing) {
        this.ringing = ringing;
    }

    public String getAirFluxDirection() {
        return airFluxDirection;
    }

    public void setAirFluxDirection(String airFluxDirection) {
        this.airFluxDirection = airFluxDirection;
    }

    public Integer getAirFluxRate() {
        return airFluxRate;
    }

    public void setAirFluxRate(Integer airFluxRate) {
        this.airFluxRate = airFluxRate;
    }

    public String getAlarmSong() {
        return alarmSong;
    }

    public void setAlarmSong(String alarmSong) {
        this.alarmSong = alarmSong;
    }

    public String getCoffeeType() {
        return coffeeType;
    }

    public void setCoffeeType(String coffeeType) {
        this.coffeeType = coffeeType;
    }

    public Float getCycleTime() {
        return cycleTime;
    }

    public void setCycleTime(Float cycleTime) {
        this.cycleTime = cycleTime;
    }

    public String getDryingMode() {
        return dryingMode;
    }

    public void setDryingMode(String dryingMode) {
        this.dryingMode = dryingMode;
    }

    public String getWashingMode() {
        return washingMode;
    }

    public void setWashingMode(String washingMode) {
        this.washingMode = washingMode;
    }

    public Integer getWaterPercentage() {
        return waterPercentage;
    }

    public void setWaterPercentage(Integer waterPercentage) {
        this.waterPercentage = waterPercentage;
    }

    public Integer getConditionerPercentage() {
        return conditionerPercentage;
    }

    public void setConditionerPercentage(Integer conditionerPercentage) {
        this.conditionerPercentage = conditionerPercentage;
    }

    public Integer getDetergentPercentage() {
        return detergentPercentage;
    }

    public void setDetergentPercentage(Integer detergentPercentage) {
        this.detergentPercentage = detergentPercentage;
    }

    public Integer getShuttersPercentage() {
        return shuttersPercentage;
    }

    public void setShuttersPercentage(Integer shuttersPercentage) {
        this.shuttersPercentage = shuttersPercentage;
    }

    public String getAirType() {
        return airType;
    }

    public void setAirType(String airType) {
        this.airType = airType;
    }

    @Override
    public String toString() {
        return "Device{" +
                "deviceId='" + deviceId + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", state=" + state +
                ", brightness=" + brightness +
                ", color='" + color + '\'' +
                ", openPercentage=" + openPercentage +
                ", volume=" + volume +
                ", temperature=" + temperature +
                ", mode='" + mode + '\'' +
                ", ringing=" + ringing +
                ", airFluxDirection='" + airFluxDirection + '\'' +
                ", airFluxRate=" + airFluxRate +
                ", alarmSong='" + alarmSong + '\'' +
                ", coffeeType='" + coffeeType + '\'' +
                ", cycleTime=" + cycleTime +
                ", dryingMode='" + dryingMode + '\'' +
                ", washingMode='" + washingMode + '\'' +
                ", waterPercentage=" + waterPercentage +
                ", conditionerPercentage=" + conditionerPercentage +
                ", detergentPercentage=" + detergentPercentage +
                ", shuttersPercentage=" + shuttersPercentage +
                '}';
    }
}
