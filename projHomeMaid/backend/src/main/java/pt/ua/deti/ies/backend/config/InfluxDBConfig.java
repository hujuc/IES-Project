package pt.ua.deti.ies.backend.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class InfluxDBConfig {

    @Value("${influxdb.token}")
    private String influxToken;

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(
                "http://influxdb:8086",
                influxToken.toCharArray(),
                "HomeMaidOrg",
                "sensor_data"
        );

    }
}