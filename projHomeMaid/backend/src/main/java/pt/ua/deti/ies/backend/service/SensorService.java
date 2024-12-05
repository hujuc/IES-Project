package pt.ua.deti.ies.backend.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.influxdb.client.QueryApi;
import org.springframework.stereotype.Service;
import com.influxdb.query.FluxTable;
import pt.ua.deti.ies.backend.model.Sensor;
import com.influxdb.client.domain.WritePrecision;

import java.util.List;

@Service
public class SensorService {

    private final InfluxDBClient influxDBClient;

    public SensorService(InfluxDBClient influxDBClient) {
        this.influxDBClient = influxDBClient;
    }

    public void saveSensor(Sensor sensorData) {
        if (sensorData.getSensorId() == null || sensorData.getRoomId() == null ||
                sensorData.getHouseId() == null || sensorData.getType() == null || sensorData.getValue() == null) {
            throw new IllegalArgumentException("Todos os campos sensorId, roomId, houseId, type e value são obrigatórios.");
        }

        try (WriteApi writeApi = influxDBClient.getWriteApi()) {
            // String de dados sem o timestamp
            String data = String.format(
                    "%s,sensor_id=%s,room_id=%s,house_id=%s,name=\"%s\",unit=\"%s\" value=%f",
                    sensorData.getType(),
                    sensorData.getSensorId(),
                    sensorData.getRoomId(),
                    sensorData.getHouseId(),
                    sensorData.getName(),
                    sensorData.getUnit(),
                    sensorData.getValue()
            );

            String bucket = "sensor_data"; // Bucket configurado no InfluxDB
            String org = "HomeMaidOrg";   // Organização configurada no InfluxDB

            // O InfluxDB irá gerar o timestamp automaticamente
            writeApi.writeRecord(bucket, org, WritePrecision.NS, data);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar dados no InfluxDB: " + e.getMessage(), e);
        }
    }




    public String getAverageTemperature(String roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("O ID do quarto é obrigatório.");
        }

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -1d) " +
                        "|> filter(fn: (r) => r[\"room_id\"] == \"%s\" and r[\"_measurement\"] == \"temperature\") " +
                        "|> mean()", roomId
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);

            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Nenhum dado encontrado para o quarto: " + roomId;
            }

            // Extrair o valor médio da tabela
            Object meanValue = tables.get(0).getRecords().get(0).getValue();
            return String.format("A temperatura média do quarto '%s' é: %s", roomId, meanValue);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar a temperatura média: " + e.getMessage(), e);
        }
    }

    public String getSensor(String sensorId) {
        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -1d) " +
                        "|> filter(fn: (r) => r[\"sensor_id\"] == \"%s\")", sensorId
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);

            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Nenhum dado encontrado para o sensor: " + sensorId;
            }

            StringBuilder result = new StringBuilder();
            for (FluxTable table : tables) {
                table.getRecords().forEach(record -> result.append(record.getValue()).append("\n"));
            }
            return result.toString();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar dados do sensor: " + e.getMessage(), e);
        }
    }

    public String getTemperatureRange(String roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("O ID do quarto é obrigatório.");
        }

        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -1d) " +
                        "|> filter(fn: (r) => r[\"room_id\"] == \"%s\" and r[\"_measurement\"] == \"temperature\") " +
                        "|> reduce(identity: {min: inf, max: -inf}, fn: (r, accumulator) => " +
                        "{min: if r._value < accumulator.min then r._value else accumulator.min, " +
                        "max: if r._value > accumulator.max then r._value else accumulator.max})", roomId
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        try {
            List<FluxTable> tables = queryApi.query(fluxQuery);

            if (tables.isEmpty() || tables.get(0).getRecords().isEmpty()) {
                return "Nenhum dado encontrado para o quarto: " + roomId;
            }

            Object minValue = tables.get(0).getRecords().get(0).getValueByKey("min");
            Object maxValue = tables.get(0).getRecords().get(0).getValueByKey("max");

            return String.format("A temperatura mínima no quarto '%s' é: %s, e a máxima é: %s", roomId, minValue, maxValue);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar a faixa de temperatura: " + e.getMessage(), e);
        }
    }
}
