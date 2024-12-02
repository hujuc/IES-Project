from kafka import KafkaProducer
import requests
import random
import time
import json

# Configuração do Kafka
KAFKA_BROKER = "kafka:9092"
TOPIC_SENSOR_DATA = "sensor_data"
TOPIC_DEVICE_AUTOMATIONS = "device_automations"

# Endpoints do backend
BACKEND_SENSORS_URL = "http://backend:8080/api/sensors"
BACKEND_DEVICES_URL = "http://backend:8080/api/devices"

# Criar o Kafka producer
producer = KafkaProducer(bootstrap_servers=[KAFKA_BROKER],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

# Função para buscar sensores existentes
def fetch_existing_sensors():
    try:
        response = requests.get(BACKEND_SENSORS_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Erro ao buscar sensores: {e}")
        return []

# Função para buscar dispositivos existentes
def fetch_existing_devices():
    try:
        response = requests.get(BACKEND_DEVICES_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Erro ao buscar dispositivos: {e}")
        return []

# Função para gerar dados aleatórios de sensores
def generate_sensor_data(sensor):
    return {
        "sensorId": sensor["sensorId"],
        "name": sensor["name"],
        "type": sensor["type"],
        "value": random.uniform(10, 50),  # Valor aleatório ajustável
        "unit": sensor["unit"],  # Assume-se que a unidade existe no sensor
        "houseId": sensor["houseId"]
    }

# Função para gerar automatizações para dispositivos
def generate_device_automation(device):
    automation = {"deviceId": device["deviceId"], "name": device["name"], "type": device["type"]}

    if device["type"] == "coffee machine":
        automation["action"] = "brew coffee"
        automation["drinkType"] = random.choice(["espresso", "latte", "americano"])
    elif device["type"] == "air conditioner":
        automation["action"] = "adjust temperature"
        automation["temperature"] = random.uniform(18, 30)
        automation["mode"] = random.choice(["cool", "heat", "fan"])
    elif device["type"] == "clock alarm":
        automation["action"] = "set alarm"
        automation["time"] = f"{random.randint(6, 23)}:{random.randint(0, 59):02d}"
        automation["volume"] = random.randint(1, 10)
    elif device["type"] == "light bulb":
        automation["action"] = "adjust lighting"
        automation["brightness"] = random.randint(0, 100)
        automation["color"] = random.choice(["red", "blue", "green", "white", "yellow"])
    else:
        automation["action"] = "unknown action"

    return automation

# Função para enviar dados ao Kafka
def send_data_to_kafka(topic, data):
    producer.send(topic, value=data)
    producer.flush()

# Loop principal
if __name__ == "__main__":
    while True:
        # Buscar sensores e dispositivos
        sensors = fetch_existing_sensors()
        devices = fetch_existing_devices()

        if not sensors:
            print("Nenhum sensor encontrado. Tentando novamente em 10 segundos...")
            time.sleep(10)
            continue

        if not devices:
            print("Nenhum dispositivo encontrado. Tentando novamente em 10 segundos...")
            time.sleep(10)
            continue

        # Gerar e enviar dados de sensores
        for sensor in sensors:
            sensor_data = generate_sensor_data(sensor)
            send_data_to_kafka(TOPIC_SENSOR_DATA, sensor_data)
            print(f"Dado do sensor enviado: {sensor_data}")

        # Gerar e enviar automatizações para dispositivos
        for device in devices:
            device_automation = generate_device_automation(device)
            send_data_to_kafka(TOPIC_DEVICE_AUTOMATIONS, device_automation)
            print(f"Automatização do dispositivo enviada: {device_automation}")

        # Intervalo entre gerações
        time.sleep(10)
