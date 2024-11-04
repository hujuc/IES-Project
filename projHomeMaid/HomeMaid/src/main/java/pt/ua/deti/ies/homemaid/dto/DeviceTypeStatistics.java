package pt.ua.deti.ies.homemaid.dto;

public class DeviceTypeStatistics {

    private int deviceCount;
    private double totalUsage;

    public DeviceTypeStatistics(int deviceCount, double totalUsage) {
        this.deviceCount = deviceCount;
        this.totalUsage = totalUsage;
    }

    // Getters and setters
    public int getDeviceCount() {
        return deviceCount;
    }

    public void setDeviceCount(int deviceCount) {
        this.deviceCount = deviceCount;
    }

    public double getTotalUsage() {
        return totalUsage;
    }

    public void setTotalUsage(double totalUsage) {
        this.totalUsage = totalUsage;
    }
}
