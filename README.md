# HomeMaid

## Project Abstract

HomeMaid is a system for monitoring and managing devices and conditions in smart houses. Using consumption sensors, the platform collects real-time data and identifies anomalous conditions. The system allows users to remotely monitor and control the environment through a web portal.

---

## Project Team

| Name                        | Role           |
|----------------------------|----------------|
| Ângela Ribeiro - 109061    | Team Manager   |
| Rita Silva - 114220        | Product Owner  |
| Regina Tavares - 114129    | Architect      |
| Hugo Castro - 114220       | DevOps Master  |

---

## HomeMaid Bookmarks

- [Technical Report – Product Specification](https://docs.google.com/document/d/16_9yoN_G7V7Le3iXELJSOmXPy8zNDtbS/edit?usp=sharing&ouid=113931485348628095672&rtpof=true&sd=true)
- [Project Prototype on Figma](https://www.figma.com/design/n16XUMfPdKDEpclR5a7mAj/HomeMaid?node-id=0-1&t=gj160MrT3jHejBbO-1)

---

## Usage

To run the project locally, execute the following commands inside the `deployment` directory:

```bash
# Start the application
docker compose -f projHomeMaid/deployment/docker-compose.prod.yml up --build
```

To generate the InfluxDB token, you may need `jq` installed:

```bash
sudo apt-get install jq
```

Then run:

```bash
./generate_influx_token.sh

docker compose -f projHomeMaid/deployment/docker-compose.prod.yml --env-file .env up --build
```

---

## Test Account

To see the data generation at full capacity, use the following account:

- **Email**: aritafs04@gmail.com  
- **Password**: rita1234
