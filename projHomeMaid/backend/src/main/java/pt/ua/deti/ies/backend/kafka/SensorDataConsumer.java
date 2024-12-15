package pt.ua.deti.ies.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SensorDataConsumer {

    private final ObjectMapper objectMapper;

    public SensorDataConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "sensor_data", groupId = "sensor-data-group")
    public void consumeSensorData(ConsumerRecord<String, String> record) {
        try {
            // Deserializar a mensagem recebida
            Map<String, Object> sensorData = objectMapper.readValue(record.value(), Map.class);

            // Imprimir no console os dados recebidos
            System.out.println("Dados do sensor recebidos: " + sensorData);
        } catch (Exception e) {
            System.err.println("Erro ao processar os dados do sensor: " + e.getMessage());
        }
    }
}