import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/coffeeMachinePage/StateControl.jsx"; // Chamar o novo StateControl unificado
import CoffeeMachAutomation from "../../components/automationsPages/coffeeMachinePage/coffeeMachAutomation.jsx";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import { useNavigate } from "react-router-dom"; // Import for redirecting to login

export default function CoffeeMachineControl() {
    const { deviceId } = useParams(); // Extrair deviceId da URL
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // For navigation

    // Buscar dados do dispositivo pela API
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.log("Token not found. Redirecting to login page.");
            navigate("/login");
            return;
        }
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setDeviceData(data);
                setLoading(false);
                if(response.ok){
                    console.log("Coffe Machine Data Fetched Success");
                }else if (response.status === 403){
                    console.log("Unauthorized Access");
                    navigate("/login")
                }
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
            }
        };

        fetchDeviceData();

        // Conectar ao WebSocket com SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000, // Reconectar automaticamente após 5 segundos se desconectado
            heartbeatIncoming: 4000, // Checar o servidor a cada 4 segundos
            heartbeatOutgoing: 4000, // Informar ao servidor que o cliente está ativo a cada 4 segundos
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            // Subscribing para atualizações do dispositivo específico
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    setDeviceData((prev) => ({ ...prev, ...updatedData }));
                    console.log("Data updated in frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Fechar conexão quando o componente desmontar
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
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com AutomationsHeader */}
            <AutomationsHeader />

            {/* Título da Máquina de Café */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceData.name || "Coffee Machine"}</span>
            </div>

            {/* StateControl */}
            <div className="mt-8">
                <StateControl deviceId={deviceId} deviceData={deviceData} />
            </div>

            {/* Automations */}
            <AutomationBox deviceId={deviceId}>
                <CoffeeMachAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
