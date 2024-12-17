#!/bin/bash

# Variáveis
INFLUX_HOST="http://localhost:8086"
ORG_NAME="HomeMaidOrg"
BUCKET_NAME="sensor_data"

# Buscar o ID do bucket
BUCKET_ID=$(docker exec -it influxdb_dev influx bucket list | grep "$BUCKET_NAME" | awk '{print $1}')

if [ -z "$BUCKET_ID" ]; then
  echo "Erro: Não foi possível encontrar o ID do bucket $BUCKET_NAME."
  exit 1
fi

# Criar token
TOKEN_OUTPUT=$(docker exec -it influxdb_dev influx auth create \
  --org "$ORG_NAME" \
  --write-bucket "$BUCKET_ID" \
  --read-bucket "$BUCKET_ID" \
  --json)

TOKEN=$(echo "$TOKEN_OUTPUT" | jq -r '.token')

if [ -z "$TOKEN" ]; then
  echo "Erro: Não foi possível gerar o token."
  exit 1
fi

# Salvar token no .env
echo "INFLUXDB_TOKEN=$TOKEN" > .env

echo "Token gerado e salvo no arquivo .env:"
echo "INFLUXDB_TOKEN=$TOKEN"