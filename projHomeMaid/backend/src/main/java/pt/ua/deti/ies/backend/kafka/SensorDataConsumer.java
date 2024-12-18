package pt.ua.deti.ies.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.Sensor;
import pt.ua.deti.ies.backend.service.SensorService;

import java.util.Map;

@Service
public class SensorDataConsumer {

    private final ObjectMapper objectMapper;
    private final SensorService sensorService;

    public SensorDataConsumer(ObjectMapper objectMapper, SensorService sensorService) {
        this.objectMapper = objectMapper;
        this.sensorService = sensorService;
    }

    @KafkaListener(topics = "sensor_data", groupId = "sensor-data-group")
    public void consumeSensorData(ConsumerRecord<String, String> record) {
        try {
            Map<String, Object> sensorData = objectMapper.readValue(record.value(), Map.class);

            Sensor sensor = new Sensor();
            sensor.setSensorId((String) sensorData.get("sensorId"));
            sensor.setRoomId((String) sensorData.get("roomId"));
            sensor.setHouseId((String) sensorData.get("houseId"));
            sensor.setType((String) sensorData.get("type"));
            sensor.setValue(Double.parseDouble(sensorData.get("value").toString()));
            sensor.setUnit((String) sensorData.get("unit"));
            sensor.setName((String) sensorData.get("name"));

            sensorService.saveSensor(sensor);

            System.out.println("Dados do sensor processados e salvos: " + sensor);
        } catch (Exception e) {
            System.err.println("Erro ao processar os dados do sensor: " + e.getMessage() + "\n Dados tentados: " + record.value());
        }
    }
}