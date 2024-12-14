import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importa useParams do React Router
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import ClockCentralControl from "../../components/automationsPages/clockPage/ClockCentralControl.jsx";
import AutomatizeAlarmClock from "../../components/automationsPages/clockPage/AutomatizeAlarmClock.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function ClockControl() {
    const { deviceId } = useParams(); // Captura o deviceId da URL
    const [deviceName, setDeviceName] = useState("Clock"); // Nome padrão
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!deviceId) {
            console.error("Device ID is missing");
            setError("Device ID is missing");
            return;
        }

        const fetchClockData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch device: ${response.statusText}`);
                }
                const data = await response.json();
                setDeviceName(data.name || "Clock"); // Define o nome do dispositivo
            } catch (err) {
                console.error("Error fetching clock data:", err);
                setError("Failed to fetch the clock data.");
            }
        };

        fetchClockData();

        // Configuração do WebSocket
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.name) setDeviceName(updatedData.name);
                    console.log("Updated data in frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Desconecta no unmount
    }, [deviceId]);

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Título */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* Controle Central do Relógio */}
            <div className="mt-6">
                <ClockCentralControl deviceId={deviceId} />
            </div>

            {/* Automation Box */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeAlarmClock deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
