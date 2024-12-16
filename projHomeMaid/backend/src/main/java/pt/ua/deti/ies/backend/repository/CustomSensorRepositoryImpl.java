package pt.ua.deti.ies.backend.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
public class CustomSensorRepositoryImpl implements CustomSensorRepository {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public CustomSensorRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void updateSensorFields(String sensorId, String roomId, String houseId, String type, Double value, String unit, String name) {
        Query query = new Query(Criteria.where("sensorId").is(sensorId));
        Update update = new Update()
                .set("roomId", roomId)
                .set("houseId", houseId)
                .set("type", type)
                .set("value", value)
                .set("unit", unit)
                .set("name", name);

        mongoTemplate.updateFirst(query, update, "sensors");
    }
}
