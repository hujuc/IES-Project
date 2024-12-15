package pt.ua.deti.ies.backend.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.influxdb.client.QueryApi;
import org.springframework.stereotype.Service;
import com.influxdb.query.FluxTable;
import pt.ua.deti.ies.backend.model.Sensor;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.query.FluxRecord;
import java.util.List;
import java.util.ArrayList;
import pt.ua.deti.ies.backend.repository.SensorRepository;

@Service
public class SensorService {

    private final InfluxDBClient influxDBClient;
    private final SensorRepository sensorRepository;

    public SensorService(InfluxDBClient influxDBClient, SensorRepository sensorRepository) {
        this.influxDBClient = influxDBClient;
        this.sensorRepository = sensorRepository;
    }

    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    public void saveSensor(Sensor sensorData) {
        if (sensorData.getSensorId() == null || sensorData.getRoomId() == null ||
                sensorData.getHouseId() == null || sensorData.getType() == null || sensorData.getValue() == null) {
            throw new IllegalArgumentException("Todos os campos sensorId, roomId, houseId, type e value são obrigatórios.");
        }

        sensorRepository.save(sensorData);

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

        // Define o filtro com base no idType
        String filter = idType.equalsIgnoreCase("house")
                ? String.format("r[\"house_id\"] == \"%s\"", id)
                : String.format("r[\"room_id\"] == \"%s\"", id);

        // Monta a query Flux para calcular a humidade média
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
            // Executa a query
            List<FluxTable> tables = queryApi.query(fluxQuery);
            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Média de humidade: Nenhum dado encontrado.";
            }
            // Extrai o valor da média
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
}
