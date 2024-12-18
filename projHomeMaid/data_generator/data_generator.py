from kafka import KafkaProducer
import requests
import random
import time
import json
from datetime import datetime, timedelta

# Configuração do Kafka
KAFKA_BROKER = "kafka:9092"
TOPIC_SENSOR_DATA = "sensor_data"
TOPIC_DEVICE_AUTOMATIONS = "device_automations"

# Endpoints do backend
BACKEND_SENSORS_URL = "http://backend:8080/api/sensors"
BACKEND_DEVICES_URL = "http://backend:8080/api/devices"

producer = KafkaProducer(
    bootstrap_servers="kafka:9092",
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Dispositivos que não podem ser desligados
CANNOT_BE_TURNED_OFF = ["clock", "dryerMachine", "washingMachine", "coffeeMachine"]

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
        "houseId": sensor["houseId"],
        "roomId": sensor["roomId"],
    }

# Função para gerar um timestamp aleatório no futuro
def generate_future_timestamp():
    now = datetime.now()
    future_time = now + timedelta(seconds=random.randint(60, 3600))  # Entre 1 minuto e 1 hora no futuro
    return future_time.isoformat()

# Função para gerar automatizações para dispositivos
def generate_device_automation(device):
    # Inicializa a automatização com o ID do dispositivo, nome, tipo, e adiciona um timestamp
    automation = {
        "deviceId": device["deviceId"],
        "name": device["name"],
        "type": device["type"],
        "executionTime": generate_future_timestamp(),
    }

    # Verifica se o dispositivo pode ser desligado
    if device["type"] in CANNOT_BE_TURNED_OFF:
        automation["state"] = True  # Sempre ligado para esses tipos
    else:
        automation["state"] = random.choice([True, False])  # Estado aleatório (ligado/desligado)

    # Adiciona valores adicionais apenas se o estado for "ligado"
    if automation["state"]:
        if device["type"] == "coffeeMachine":
            automation["drinkType"] = random.choice(["espresso", "tea", "latte"])
        elif device["type"] == "airConditioner":
            automation["temperature"] = random.randint(12, 32)
            automation["mode"] = random.choice(["hot", "cold", "air", "humid"])
            automation["airFluxDirection"] = random.choice(["up", "down"])
            automation["airFluxRate"] = random.choice(["low", "medium", "high"])
        elif device["type"] == "clock":
            automation["ringing"] = True
            automation["alarmSound"] = random.choice(["alarm1", "alarm2", "alarm3"])
            automation["volume"] = random.randint(0, 100)
        elif device["type"] == "dryerMachine":
            automation["temperature"] = random.randint(50, 90)
            automation["mode"] = random.choice(["Regular Dry", "Gentle Dry", "Permanent Press"])
        elif device["type"] == "washingMachine":
            automation["temperature"] = random.randint(20, 90)
            automation["mode"] = random.choice(["Regular Wash", "Delicate Wash", "Deep Clean"])
        elif device["type"] == "heatedFloor":
            automation["temperature"] = random.randint(0, 20)
        elif device["type"] == "lamp":
            automation["color"] = random.choice(["#ffffff", "#ff0000", "#ffc0cb", "#ffa500", "#ffd700", "#ffff00", "#00ff00", "#008080", "#add8e6", "#0000ff", "#800080"])
            automation["brightness"] = random.randint(1, 100)
        elif device["type"] == "shutter":
            automation["openPercentage"] = random.randint(0, 100)
        elif device["type"] == "stereo":
            automation["volume"] = random.randint(0, 100)
        elif device["type"] == "television":
            automation["volume"] = random.randint(0, 100)
            automation["brightness"] = random.randint(10, 100)

    return automation

# Função para enviar dados ao Kafka
def send_data_to_kafka(topic, data):
    producer.send(topic, value=data)
    producer.flush()

# Loop principal
if __name__ == "__main__":
    last_automation_time = 0  # Timestamp do último envio de automatizações
    automation_interval = 43200  # Intervalo em segundos

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

        for sensor in sensors:
            sensor_data = generate_sensor_data(sensor)
            send_data_to_kafka(TOPIC_SENSOR_DATA, sensor_data)
            print(f"Dado do sensor enviado: {sensor_data}")

        # Verificar se já passou o intervalo para gerar automatizações
        current_time = time.time()
        if current_time - last_automation_time >= automation_interval:
            for device in devices:
                device_automation = generate_device_automation(device)
                send_data_to_kafka(TOPIC_DEVICE_AUTOMATIONS, device_automation)
                print(f"Automatização do dispositivo enviada: {device_automation}")
            last_automation_time = current_time  # Atualizar o timestamp do último envio

        # Esperar 30 minutos antes de gerar os próximos dados de sensores
        time.sleep(1800)
