from kafka import KafkaProducer
import requests
import random
import time
import json

# Kafka configuration
KAFKA_BROKER = "kafka:9092"
TOPIC_NAME = "sensor_data"

# Backend API configuration
BACKEND_API_URL = "http://backend:8080/api/sensors"

# Create Kafka producer
producer = KafkaProducer(bootstrap_servers=[KAFKA_BROKER],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

# Function to fetch existing sensors
def fetch_existing_sensors():
    try:
        response = requests.get(BACKEND_API_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching sensors: {e}")
        return []

# Function to generate random sensor readings
def generate_sensor_data(sensor):
    sensor_data = {
        "sensorId": sensor["sensorId"],
        "name": sensor["name"],
        "type": sensor["type"],
        "value": random.uniform(10, 50),  # Random value, adjust range as needed
        "unit": sensor["unit"],  # Assume unit exists in the sensor object
        "houseId": sensor["houseId"]
    }
    return sensor_data

# Function to send data to Kafka
def send_data_to_kafka(data):
    producer.send(TOPIC_NAME, value=data)
    producer.flush()

# Main loop
if __name__ == "__main__":
    while True:
        sensors = fetch_existing_sensors()
        if not sensors:
            print("No sensors found. Retrying in 10 seconds...")
            time.sleep(10)
            continue

        for sensor in sensors:
            sensor_data = generate_sensor_data(sensor)
            send_data_to_kafka(sensor_data)
            print(f"Data sent for sensor {sensor['sensorId']}: {sensor_data}")

        # Adjust sleep time to control data generation frequency
        time.sleep(10)
