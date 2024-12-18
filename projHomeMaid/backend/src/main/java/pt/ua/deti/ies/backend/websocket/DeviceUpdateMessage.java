package pt.ua.deti.ies.backend.websocket;

public class DeviceUpdateMessage {

    private String deviceId;
    private String field;
    private Object value;

    public DeviceUpdateMessage() {}

    public DeviceUpdateMessage(String deviceId, String field, Object value) {
        this.deviceId = deviceId;
        this.field = field;
        this.value = value;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
