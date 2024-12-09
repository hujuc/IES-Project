import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import CentralControl from "../../components/automationsPages/coffeeMachinePage/CentralControl.jsx";
import DrinkOptions from "../../components/automationsPages/coffeeMachinePage/DrinkOptions.jsx";
import Automatize from "../../components/automationsPages/coffeeMachinePage/AutomatizeCoffee.jsx";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function CoffeeMachineControl() {
    const { deviceId } = useParams(); // Extract deviceId from the URL
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch device data from API
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();
                setDeviceData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
            }
        };

        fetchDeviceData();

        // Conectar ao WebSocket com SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws/devices"),
            reconnectDelay: 5000, // Reconecta automaticamente após 5 segundos em caso de falha
            heartbeatIncoming: 4000, // Checa o servidor a cada 4 segundos
            heartbeatOutgoing: 4000, // Informa o servidor que está vivo a cada 4 segundos
        });

        client.onConnect = () => {
            console.log("Conectado ao WebSocket STOMP!");

            // Subscribing to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Mensagem recebida via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    setDeviceData((prev) => ({ ...prev, ...updatedData }));
                    console.log("Dados atualizados no frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Erro no WebSocket STOMP:", frame.headers["message"]);
            console.error("Detalhes do erro:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Fecha a conexão ao desmontar o componente
    }, [deviceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!deviceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Failed to load device data.</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Coffee Machine Title */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Coffee Machine</span>
            </div>

            {/* Central Control */}
            <div className="mt-8">
                <CentralControl deviceId={deviceId} deviceData={deviceData} />
            </div>

            {/* Drink Options */}
            <div className="mt-8">
                <DrinkOptions deviceId={deviceId} deviceData={deviceData} />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <Automatize deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}