package pt.ua.deti.ies.backend.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.WriteApi;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InfluxDBService {

    private final InfluxDBClient influxDBClient;

    public InfluxDBService() {
        // Substitua pelos valores corretos de URL, Token, Organização e Bucket
        this.influxDBClient = InfluxDBClientFactory.create(
                "http://localhost:8086",
                "OgYZx8Gm7-SfLYY6CvDUdO7570P3IHh0r-FXcldomrjO6I2v6j7D2xspJzzY3uvnRG_60QZy4zkMgyuh0OHPsA==".toCharArray(),
                "HomeMaidOrg",
                "sensor_data"
        );
    }

    // Grava dados no InfluxDB
    public void writeSensorData(String sensorId, String type, Double value) {
        try (WriteApi writeApi = influxDBClient.getWriteApi()) {
            String data = String.format("%s,sensor_id=%s value=%f", type, sensorId, value);
            writeApi.writeRecord(WritePrecision.MS, data);
        }
    }

    // Consulta dados de um sensor no InfluxDB
    public String getSensorData(String sensorId) {
        String fluxQuery = String.format(
                "from(bucket: \"sensor_data\") " +
                        "|> range(start: -1d) " +
                        "|> filter(fn: (r) => r[\"sensor_id\"] == \"%s\")", sensorId);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        StringBuilder result = new StringBuilder();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                result.append(String.format(
                        "Time: %s, Value: %s\n",
                        record.getTime(),
                        record.getValueByKey("_value")
                ));
            }
        }
        return result.toString();
    }
}
