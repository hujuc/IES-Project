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
                "QZHt0YOy9CMogtpOSifvl9MD8TwRhOCsU0AK5RKSYIs0jTSQ1MNbMbZ61bXmziVflYm52Yrj0Ko0kSwahp2gMQ==".toCharArray(), // Token gerado no InfluxDB
                "HomeMaidOrg",                // Organização
                "sensor_data"                 // Bucket
        );
    }
}
