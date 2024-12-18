package pt.ua.deti.ies.backend.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.influxdb.client.QueryApi;
import org.springframework.stereotype.Service;
import com.influxdb.query.FluxTable;
import pt.ua.deti.ies.backend.model.Sensor;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.query.FluxRecord;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import pt.ua.deti.ies.backend.repository.SensorRepository;
import pt.ua.deti.ies.backend.repository.CustomSensorRepository;
import java.util.Optional;
import java.util.List;
import pt.ua.deti.ies.backend.websocket.SensorUpdateMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class SensorService {

    private final InfluxDBClient influxDBClient;
    private final SensorRepository sensorRepository;
    private final CustomSensorRepository customSensorRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public SensorService(InfluxDBClient influxDBClient, SensorRepository sensorRepository,
                         CustomSensorRepository customSensorRepository, SimpMessagingTemplate messagingTemplate) {
        this.influxDBClient = influxDBClient;
        this.sensorRepository = sensorRepository;
        this.customSensorRepository = customSensorRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    public void saveSensor(Sensor sensorData) {
        if (sensorData.getSensorId() == null || sensorData.getRoomId() == null ||
                sensorData.getHouseId() == null || sensorData.getType() == null || sensorData.getValue() == null) {
            throw new IllegalArgumentException("Todos os campos sensorId, roomId, houseId, type e value são obrigatórios.");
        }

        Optional<Sensor> existingSensor = sensorRepository.findBySensorId(sensorData.getSensorId());

        if (existingSensor.isPresent()) {
            customSensorRepository.updateSensorFields(
                    sensorData.getSensorId(),
                    sensorData.getRoomId(),
                    sensorData.getHouseId(),
                    sensorData.getType(),
                    sensorData.getValue(),
                    sensorData.getUnit(),
                    sensorData.getName()
            );
        } else {
            sensorRepository.save(sensorData);
        }

        saveToInfluxDB(sensorData);

        sendSensorUpdateMessage(sensorData);
    }

    private void saveToInfluxDB(Sensor sensorData) {
        try (WriteApi writeApi = influxDBClient.getWriteApi()) {
            String data = String.format(
                    "%s,sensor_id=%s,room_id=%s,house_id=%s,unit=%s value=%f",
                    sensorData.getType(),
                    sensorData.getSensorId(),
                    sensorData.getRoomId(),
                    sensorData.getHouseId(),
                    sensorData.getUnit(),
                    sensorData.getValue()
            );

            String bucket = "sensor_data";
            String org = "HomeMaidOrg";

            writeApi.writeRecord(bucket, org, WritePrecision.NS, data);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar dados no InfluxDB: " + e.getMessage(), e);
        }
    }

    private void sendSensorUpdateMessage(Sensor sensorData) {
        SensorUpdateMessage message = new SensorUpdateMessage(
                sensorData.getRoomId(),
                sensorData.getType(),
                sensorData.getValue()
        );

        messagingTemplate.convertAndSend("/topic/sensor-updates", message);
    }

    public String getAverageTemperature(String id, String idType, String timeframe) {
        if (id == null || idType == null) {
            throw new IllegalArgumentException("O ID e o tipo de ID são obrigatórios.");
        }

        String range;
        switch (timeframe.toLowerCase()) {
            case "daily":
                range = "-1d";
                break;
            case "weekly":
                range = "-7d";
                break;
            case "monthly":
                range = "-30d";
                break;
            default:
                throw new IllegalArgumentException("Timeframe inválido. Use 'daily', 'weekly' ou 'monthly'.");
        }

        String filter = idType.equalsIgnoreCase("house")
                ? String.format("r[\"house_id\"] == \"%s\"", id)
                : String.format("r[\"room_id\"] == \"%s\"", id);

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: %s) " +
                        "|> filter(fn: (r) => %s and r[\"_measurement\"] == \"temperature\") " +
                        "|> keep(columns: [\"_value\"]) " +
                        "|> mean()",
                range, filter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);
            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Média de temperatura: Nenhum dado encontrado.";
            }
            Object meanValue = tables.get(0).getRecords().get(0).getValue();
            return String.format("Média de temperatura: %.2f", Double.parseDouble(meanValue.toString()));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar a média de temperatura: " + e.getMessage(), e);
        }
    }

    public String getAverageHumidity(String id, String idType, String timeframe) {
        if (id == null || idType == null) {
            throw new IllegalArgumentException("O ID e o tipo de ID são obrigatórios.");
        }

        String range;
        switch (timeframe.toLowerCase()) {
            case "daily":
                range = "-1d";
                break;
            case "weekly":
                range = "-7d";
                break;
            case "monthly":
                range = "-30d";
                break;
            default:
                throw new IllegalArgumentException("Timeframe inválido. Use 'daily', 'weekly' ou 'monthly'.");
        }

        String filter = idType.equalsIgnoreCase("house")
                ? String.format("r[\"house_id\"] == \"%s\"", id)
                : String.format("r[\"room_id\"] == \"%s\"", id);

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: %s) " +
                        "|> filter(fn: (r) => %s and r[\"_measurement\"] == \"humidity\") " +
                        "|> keep(columns: [\"_value\"]) " + // Mantenha apenas a coluna _value
                        "|> mean()",
                range, filter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);
            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Média de humidade: Nenhum dado encontrado.";
            }

            Object meanValue = tables.get(0).getRecords().get(0).getValue();
            return String.format("Média de humidade: %.2f", Double.parseDouble(meanValue.toString()));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar a média de humidade: " + e.getMessage(), e);
        }
    }



    public String getSensor(String sensorId) {
        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -30d) " +
                        "|> filter(fn: (r) => r[\"sensor_id\"] == \"%s\")",
                sensorId
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);
            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Nenhum dado encontrado para o sensor: " + sensorId;
            }

            StringBuilder result = new StringBuilder();
            for (FluxTable table : tables) {
                table.getRecords().forEach(record ->
                        result.append("Time: ").append(record.getTime()).append(", ")
                                .append("Value: ").append(record.getValue()).append("\n")
                );
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar dados do sensor: " + e.getMessage(), e);
        }
    }

    public double getLatestMeasurementAsDouble(String id, String idType, String measurementType) {
        String filter = idType.equalsIgnoreCase("house")
                ? String.format("r[\"house_id\"] == \"%s\"", id)
                : String.format("r[\"room_id\"] == \"%s\"", id);

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -30d) " +
                        "|> filter(fn: (r) => %s and r[\"_measurement\"] == \"%s\") " +
                        "|> sort(columns: [\"_time\"], desc: true) " +
                        "|> limit(n: 1)",
                filter, measurementType
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);
            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                throw new RuntimeException("No data found for measurement: " + measurementType);
            }

            FluxRecord record = tables.get(0).getRecords().get(0);
            return Double.parseDouble(record.getValue().toString());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching latest measurement as double: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> getRoomGraphData(String roomId, String timeframe) {
        String range = switch (timeframe.toLowerCase()) {
            case "weekly" -> "-7d";
            case "monthly" -> "-30d";
            default -> "-1d";
        };

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: %s) " +
                        "|> filter(fn: (r) => r[\"room_id\"] == \"%s\" and (r[\"_measurement\"] == \"temperature\" or r[\"_measurement\"] == \"humidity\")) " +
                        "|> pivot(rowKey:[\"_time\"], columnKey:[\"_measurement\"], valueColumn:\"_value\") " +
                        "|> keep(columns: [\"_time\", \"temperature\", \"humidity\"])",
                range, roomId
        );

        System.out.println("Executando query no InfluxDB: " + fluxQuery);

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);

            if (tables.isEmpty()) {
                System.err.println("Nenhum dado retornado do InfluxDB.");
                return Collections.emptyList();
            }

            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    System.out.println("Registro encontrado: " + record);
                }
            }

            return tables.stream()
                    .flatMap(table -> table.getRecords().stream())
                    .map(record -> {
                        Map<String, Object> result = new HashMap<>();
                        result.put("time", record.getTime());
                        result.put("temperature", record.getValueByKey("temperature"));
                        result.put("humidity", record.getValueByKey("humidity"));
                        return result;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Erro ao executar query: " + e.getMessage());
            throw new RuntimeException("Erro ao buscar dados do gráfico: " + e.getMessage(), e);
        }
    }





}
