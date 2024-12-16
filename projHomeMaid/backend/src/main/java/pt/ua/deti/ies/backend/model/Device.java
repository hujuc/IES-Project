package pt.ua.deti.ies.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "devices")
public class Device {
    @Id
    private String deviceId;
    private String name;
    private String type;
    private Boolean state = false;
    private Integer brightness;
    private String color;
    private Integer openPercentage;
    private Integer volume;
    private Double temperature;
    private String mode;
    private Boolean ringing;
    private String airFluxDirection;
    private String airFluxRate;
    private String drinkType;
    private String alarmSound;
    private boolean receiveAutomationNotification = true;

    public Device(String deviceId, String name, String type, Boolean state, Integer brightness, String color,
                  Integer openPercentage, Integer volume, Double temperature, String mode, Boolean ringing,
                  String airFluxDirection, String airFluxRate, String drinkType, String alarmSound, boolean receiveAutomationNotification) {
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
        this.drinkType = drinkType;
        this.alarmSound = alarmSound;
        this.receiveAutomationNotification = receiveAutomationNotification;
    }

    public Device(String deviceId, String type) {
        this.deviceId = deviceId;
        this.type = type;
    }

    public Device() {}

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

    public String getAirFluxRate() {
        return airFluxRate;
    }

    public void setAirFluxRate(String airFluxRate) {
        this.airFluxRate = airFluxRate;
    }

    public String getDrinkType() {
        return drinkType;
    }

    public void setDrinkType(String drinkType) {
        this.drinkType = drinkType;
    }

    public String getAlarmSound() {
        return alarmSound;
    }

    public void setAlarmSound(String alarmSound) {
        this.alarmSound = alarmSound;
    }

    public Boolean getReceiveAutomationNotification() {
        return receiveAutomationNotification;
    }

    public void setReceiveAutomationNotification(Boolean receiveAutomationNotification) {
        this.receiveAutomationNotification = receiveAutomationNotification;
    }

    @java.lang.Override
    public java.lang.String toString() {
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
                ", drinkTYpe =" + drinkType +
                ", alarmSound =" + alarmSound +
                '}';
    }
}