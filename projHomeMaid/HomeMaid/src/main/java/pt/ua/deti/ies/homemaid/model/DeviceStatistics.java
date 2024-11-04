package pt.ua.deti.ies.homemaid.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.LocalDate;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;
import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.CLUSTERED;

@Table("device_statistics")
public class DeviceStatistics {

    @PrimaryKeyColumn(name = "houseId", ordinal = 0, type = PARTITIONED)
    private String houseId;

    @PrimaryKeyColumn(name = "deviceId", ordinal = 1, type = PARTITIONED)
    private String deviceId;

    @PrimaryKeyColumn(name = "date", ordinal = 2, type = CLUSTERED)
    private LocalDate date;

    private String type;
    private double usage;

    // Constructors
    public DeviceStatistics() {}

    public DeviceStatistics(String houseId, String deviceId, LocalDate date, String type, double usage) {
        this.houseId = houseId;
        this.deviceId = deviceId;
        this.date = date;
        this.type = type;
        this.usage = usage;
    }

    // Getters and Setters
    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getUsage() {
        return usage;
    }

    public void setUsage(double usage) {
        this.usage = usage;
    }

    @Override
    public String toString() {
        return "DeviceStatistics{" +
                "houseId='" + houseId + '\'' +
                ", deviceId='" + deviceId + '\'' +
                ", date=" + date +
                ", type='" + type + '\'' +
                ", usage=" + usage +
                '}';
    }
}
