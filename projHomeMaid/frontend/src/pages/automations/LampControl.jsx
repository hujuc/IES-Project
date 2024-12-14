import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import LampAutomation from "../../components/automationsPages/LampPage/LampAutomation.jsx";
import StateControl from "../../components/automationsPages/LampPage/StateControl.jsx";

export default function LampControl() {
    const [isLightOn, setIsLightOn] = useState(false);
    const [brightness, setBrightness] = useState(50); // Brilho padrão
    const [color, setColor] = useState("#ffffff"); // Cor padrão (branca)
    const [deviceName, setDeviceName] = useState("Light Bulb"); // Nome padrão
    const [error, setError] = useState(null);

    // Obter ID do dispositivo da URL
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    useEffect(() => {
        const fetchLightData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                // Atualizar os estados com os valores retornados do backend
                setIsLightOn(data.state || false); // Estado inicial
                setBrightness(data.brightness || 50); // Brilho inicial
                setColor(data.color || "#ffffff"); // Cor inicial
                setDeviceName(data.name || "Light Bulb"); // Nome do dispositivo
            } catch (err) {
                console.error("Erro ao buscar o estado da lâmpada:", err);
                setError("Falha ao buscar o estado da lâmpada.");
            }
        };

        fetchLightData();

        // Conectar ao WebSocket com SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Conectado ao WebSocket STOMP!");

            // Subscribing to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Mensagem recebida via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsLightOn(updatedData.state);
                    if (updatedData.brightness !== undefined) setBrightness(updatedData.brightness);
                    if (updatedData.color !== undefined) setColor(updatedData.color);
                    if (updatedData.name !== undefined) setDeviceName(updatedData.name);
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

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Título do dispositivo */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* Controle de Estado */}
            <StateControl
                isLightOn={isLightOn}
                setIsLightOn={setIsLightOn}
                brightness={brightness}
                setBrightness={setBrightness}
                color={color}
                setColor={setColor}
                deviceId={deviceId}
                error={error}
            />

            {/* Automatização */}
            <AutomationBox deviceId={deviceId}>
                <LampAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
