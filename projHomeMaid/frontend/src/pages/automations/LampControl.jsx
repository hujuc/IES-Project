import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import LampAutomation from "../../components/automationsPages/lampPage/LampAutomation.jsx";
import StateControl from "../../components/automationsPages/lampPage/StateControl.jsx";
import { useNavigate } from "react-router-dom";


export default function LampControl() {
    const [isLightOn, setIsLightOn] = useState(false);
    const [brightness, setBrightness] = useState(50);
    const [color, setColor] = useState("#ffffff");
    const [deviceName, setDeviceName] = useState("Light Bulb");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    useEffect(() => {
        const fetchLightData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`,{
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();

                setIsLightOn(data.state || false);
                setBrightness(data.brightness || 50);
                setColor(data.color || "#ffffff");
                setDeviceName(data.name || "Light Bulb");

                if(response.status === 403){
                    navigate("/login");
                }
            } catch (err) {
                console.error("Erro ao buscar o estado da lâmpada:", err);
                setError("Falha ao buscar o estado da lâmpada.");
            }
        };

        fetchLightData();

        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsLightOn(updatedData.state);
                    if (updatedData.brightness !== undefined) setBrightness(updatedData.brightness);
                    if (updatedData.color !== undefined) setColor(updatedData.color);
                    if (updatedData.name !== undefined) setDeviceName(updatedData.name);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Erro no WebSocket STOMP:", frame.headers["message"]);
            console.error("Detalhes do erro:", frame.body);
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            <AutomationsHeader />

            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

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

            <AutomationBox deviceId={deviceId}>
                <LampAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
