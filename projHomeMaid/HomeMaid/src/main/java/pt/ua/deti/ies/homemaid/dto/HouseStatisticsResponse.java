package pt.ua.deti.ies.homemaid.dto;

import pt.ua.deti.ies.homemaid.model.House;
import java.util.List;
import java.util.Map;

public class HouseStatisticsResponse {

    private House house;
    private double totalEnergyUsage;
    private List<Double> monthlyUsage;
    private Map<String, DeviceTypeStatistics> deviceTypeUsage;

    public HouseStatisticsResponse(House house, double totalEnergyUsage, List<Double> monthlyUsage,
                                   Map<String, DeviceTypeStatistics> deviceTypeUsage) {
        this.house = house;
        this.totalEnergyUsage = totalEnergyUsage;
        this.monthlyUsage = monthlyUsage;
        this.deviceTypeUsage = deviceTypeUsage;
    }

    // Getters and setters
    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }

    public double getTotalEnergyUsage() {
        return totalEnergyUsage;
    }

    public void setTotalEnergyUsage(double totalEnergyUsage) {
        this.totalEnergyUsage = totalEnergyUsage;
    }

    public List<Double> getMonthlyUsage() {
        return monthlyUsage;
    }

    public void setMonthlyUsage(List<Double> monthlyUsage) {
        this.monthlyUsage = monthlyUsage;
    }

    public Map<String, DeviceTypeStatistics> getDeviceTypeUsage() {
        return deviceTypeUsage;
    }

    public void setDeviceTypeUsage(Map<String, DeviceTypeStatistics> deviceTypeUsage) {
        this.deviceTypeUsage = deviceTypeUsage;
    }
}
