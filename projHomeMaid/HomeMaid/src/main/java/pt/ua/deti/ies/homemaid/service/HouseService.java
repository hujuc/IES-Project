package pt.ua.deti.ies.homemaid.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;

import pt.ua.deti.ies.homemaid.model.House;
import pt.ua.deti.ies.homemaid.model.DeviceStatistics;
import pt.ua.deti.ies.homemaid.repository.HouseRepository;
import pt.ua.deti.ies.homemaid.repository.DeviceStatisticsRepository;
import pt.ua.deti.ies.homemaid.dto.HouseStatisticsResponse;
import pt.ua.deti.ies.homemaid.dto.DeviceTypeStatistics;

@Service
public class HouseService {
    private static final Logger logger = LoggerFactory.getLogger(HouseService.class);

    private final HouseRepository houseRepository;
    private final DeviceStatisticsRepository deviceStatisticsRepository;

    public HouseService(HouseRepository houseRepository, DeviceStatisticsRepository deviceStatisticsRepository) {
        this.houseRepository = houseRepository;
        this.deviceStatisticsRepository = deviceStatisticsRepository;
    }

    public Optional<HouseStatisticsResponse> getHouseStatistics(String houseId) {
        logger.info("Fetching house statistics for ID: {}", houseId);
        Optional<House> houseOpt = houseRepository.findById(houseId);

        if (houseOpt.isEmpty()) {
            logger.warn("House ID {} not found in MongoDB", houseId);
            return Optional.empty();
        }

        House house = houseOpt.get();
        logger.info("House retrieved from MongoDB: {}", house);

        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();

        // Retrieve daily usage statistics for the current month from Cassandra
        List<DeviceStatistics> deviceStats = deviceStatisticsRepository.findByHouseIdAndDateBetween(
                houseId, startOfMonth, endOfMonth);
        logger.info("Device statistics retrieved from Cassandra: {}", deviceStats);

        double totalUsage = 0;
        Map<String, DeviceTypeStatistics> deviceTypeUsage = new HashMap<>();

        for (DeviceStatistics stats : deviceStats) {
            totalUsage += stats.getUsage();
            deviceTypeUsage.merge(stats.getType(), new DeviceTypeStatistics(1, stats.getUsage()),
                    (existing, newStats) -> {
                        existing.setDeviceCount(existing.getDeviceCount() + 1);
                        existing.setTotalUsage(existing.getTotalUsage() + newStats.getTotalUsage());
                        return existing;
                    });
        }

        logger.info("Total energy usage calculated: {}", totalUsage);
        logger.info("Device type usage: {}", deviceTypeUsage);

        // Generate mock monthly usage data for the past 5 months
        List<Double> monthlyUsage = getMonthlyUsageHistory(houseId, 5);

        return Optional.of(new HouseStatisticsResponse(house, totalUsage, monthlyUsage, deviceTypeUsage));
    }

    private List<Double> getMonthlyUsageHistory(String houseId, int monthsBack) {
        List<Double> monthlyUsage = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        for (int i = 0; i < monthsBack; i++) {
            YearMonth month = currentMonth.minusMonths(i);
            LocalDate startOfMonth = month.atDay(1);
            LocalDate endOfMonth = month.atEndOfMonth();

            List<DeviceStatistics> monthStats = deviceStatisticsRepository.findByHouseIdAndDateBetween(
                    houseId, startOfMonth, endOfMonth);

            double monthlyTotal = monthStats.stream().mapToDouble(DeviceStatistics::getUsage).sum();
            monthlyUsage.add(monthlyTotal);
        }

        Collections.reverse(monthlyUsage);  // To have the oldest month first
        return monthlyUsage;
    }
}
