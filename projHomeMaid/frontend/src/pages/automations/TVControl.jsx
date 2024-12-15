import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/tvPage/StateControl.jsx";
import TvAutomation from "../../components/automationsPages/tvPage/tvAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function TVControl() {
    const [isTVOn, setIsTVOn] = useState(false);
    const [volume, setVolume] = useState(50); // Volume inicial
    const [brightness, setBrightness] = useState(50); // Brilho inicial
    const [deviceName, setDeviceName] = useState("Television"); // Nome do dispositivo
    const [error, setError] = useState(null);

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch TV data from API and setup WebSocket
    useEffect(() => {
        const fetchTVData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                setIsTVOn(data.state || false);
                setVolume(data.volume != null ? data.volume : 50);
                setBrightness(data.brightness != null ? data.brightness : 50);
                setDeviceName(data.name || "Television"); // Atualiza o nome do dispositivo
            } catch (err) {
                console.error("Erro ao buscar os dados da TV:", err);
                setError("Falha ao buscar os dados da TV.");
            }
        };

        fetchTVData();

        // Setup WebSocket
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Conectado ao WebSocket STOMP!");

            // Subscribe to updates for this device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsTVOn(updatedData.state);
                    if (updatedData.volume !== undefined) setVolume(updatedData.volume);
                    if (updatedData.brightness !== undefined) setBrightness(updatedData.brightness);
                    if (updatedData.name !== undefined) setDeviceName(updatedData.name); // Atualiza o nome em tempo real
                    console.log("Dados atualizados via WebSocket:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Erro no WebSocket STOMP:", frame.headers["message"]);
            console.error("Detalhes do erro:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Cleanup WebSocket on component unmount
    }, [deviceId]);

    const toggleTV = async () => {
        try {
            const updatedState = !isTVOn;
            setIsTVOn(updatedState);

            await saveStateToDatabase(updatedState, volume, brightness);
        } catch (err) {
            console.error("Erro ao alternar a TV:", err);
            setError("Falha ao alternar a TV.");
        }
    };

    const updateVolume = async (newVolume) => {
        try {
            setVolume(newVolume);
            if (isTVOn) {
                await saveStateToDatabase(isTVOn, newVolume, brightness);
            }
        } catch (err) {
            console.error("Erro ao atualizar o volume:", err);
            setError("Falha ao atualizar o volume.");
        }
    };

    const updateBrightness = async (newBrightness) => {
        try {
            const brightnessValue = Math.max(10, Number(newBrightness));
            setBrightness(brightnessValue);

            if (isTVOn) {
                await saveStateToDatabase(isTVOn, volume, brightnessValue);
            }
        } catch (err) {
            console.error("Erro ao atualizar o brilho:", err);
            setError("Falha ao atualizar o brilho.");
        }
    };

    const saveStateToDatabase = async (state, volumeValue, brightnessValue) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    state,
                    volume: volumeValue,
                    brightness: brightnessValue,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }
        } catch (err) {
            console.error("Erro ao salvar estado e configurações da TV na base de dados:", err);
            setError("Falha ao salvar os dados na base de dados.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* Estado da TV, Volume e Brilho */}
            <StateControl
                isTVOn={isTVOn}
                toggleTV={toggleTV}
                volume={volume}
                updateVolume={updateVolume}
                brightness={Math.max(brightness, 10)}
                updateBrightness={updateBrightness}
            />

            <AutomationBox deviceId={deviceId}>
                <TvAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
