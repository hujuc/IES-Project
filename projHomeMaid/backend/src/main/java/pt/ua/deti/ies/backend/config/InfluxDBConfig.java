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
                "bLHgcV8ytd4YqVM62u7txmnY_GQUdaOVhwPHVNyY_CFOVr7lkBSA25oPafw2MAJOulhPjeFMHK9Pm1bZxAXUew==".toCharArray(), // Token gerado no InfluxDB
                "HomeMaidOrg",                // Organização
                "sensor_data"                 // Bucket
        );
    }
}
