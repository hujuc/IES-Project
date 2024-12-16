package pt.ua.deti.ies.backend.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDBConfig {

    @Bean
    public InfluxDBClient influxDBClient() {
//        return InfluxDBClientFactory.create(
//                "http://localhost:8086",      // URL do InfluxDB
//                "6ShJLV6O6TJAXikzMo9CYN9ufzFAUzhwfE0itLOXJAKKPvkycdgbdQh6ZcW8G6W4zfHRHJpXzh8rlBdCuM0rlw==".toCharArray(), // Token gerado no InfluxDB
//                "HomeMaidOrg",                // Organização
//                "sensor_data"                 // Bucket
//        );
        return InfluxDBClientFactory.create(
                "http://influxdb:8086",      // URL do InfluxDB
                "6ShJLV6O6TJAXikzMo9CYN9ufzFAUzhwfE0itLOXJAKKPvkycdgbdQh6ZcW8G6W4zfHRHJpXzh8rlBdCuM0rlw==".toCharArray(), // Token gerado no InfluxDB
                "HomeMaidOrg",                // Organização
                "sensor_data"                 // Bucket
        );
    }
}
