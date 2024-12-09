package pt.ua.deti.ies.backend.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDBConfig {

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(
                "http://localhost:8086",      // URL do InfluxDB
                "OgYZx8Gm7-SfLYY6CvDUdO7570P3IHh0r-FXcldomrjO6I2v6j7D2xspJzzY3uvnRG_60QZy4zkMgyuh0OHPsA==".toCharArray(), // Token gerado no InfluxDB
                "HomeMaidOrg",                // Organização
                "sensor_data"                 // Bucket
        );
    }
}
