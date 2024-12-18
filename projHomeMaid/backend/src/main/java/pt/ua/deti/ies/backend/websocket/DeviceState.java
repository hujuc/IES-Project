package pt.ua.deti.ies.backend.websocket;

public class DeviceState {

    private String deviceId;
    private boolean state;
    private int volume;
    private int brightness;

    public DeviceState() {}

    public DeviceState(String deviceId, boolean state, int volume, int brightness) {
        this.deviceId = deviceId;
        this.state = state;
        this.volume = volume;
        this.brightness = brightness;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public boolean isState() {
        return state;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public int getBrightness() {
        return brightness;
    }

    public void setBrightness(int brightness) {
        this.brightness = brightness;
    }
}
