import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/ShutterControlPage/StateControl.jsx";
import PercentageControl from "../../components/automationsPages/ShutterControlPage/PercentageControl.jsx";
import AutomatizeShutter from "../../components/automationsPages/ShutterControlPage/AutomatizeShutter.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function ShutterControl() {
    const DEFAULT_OPEN_PERCENTAGE = 50;
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(DEFAULT_OPEN_PERCENTAGE);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch initial shutter data and set up WebSocket
    useEffect(() => {
        const fetchShutterData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                setIsShutterOpen(data.state || false);
                setOpenPercentage(
                    data.openPercentage != null ? Number(data.openPercentage) : DEFAULT_OPEN_PERCENTAGE
                );
            } catch (err) {
                console.error("Erro ao buscar o estado da persiana:", err);
                setError("Falha ao buscar o estado da persiana.");
            }
        };

        fetchShutterData();

        // Set up WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000, // Retry connection every 5 seconds
            heartbeatIncoming: 4000, // Check server every 4 seconds
            heartbeatOutgoing: 4000, // Inform server every 4 seconds
        });

        client.onConnect = () => {
            console.log("Conectado ao WebSocket STOMP!");

            // Subscribe to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Mensagem recebida via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsShutterOpen(updatedData.state);
                    if (updatedData.openPercentage !== undefined)
                        setOpenPercentage(updatedData.openPercentage);
                    console.log("Dados atualizados no frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Erro no WebSocket STOMP:", frame.headers["message"]);
            console.error("Detalhes do erro:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Disconnect on component unmount
    }, [deviceId]);

    useEffect(() => {
        if (openPercentage === 0 && isShutterOpen) {
            saveStateToDatabase(false, 0);
            setIsShutterOpen(false);
        }
    }, [openPercentage, isShutterOpen]);

    const toggleShutter = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isShutterOpen;

            if (updatedState) {
                setOpenPercentage(DEFAULT_OPEN_PERCENTAGE);
                await saveStateToDatabase(updatedState, DEFAULT_OPEN_PERCENTAGE);
            } else {
                setOpenPercentage(0);
                await saveStateToDatabase(updatedState, 0);
            }

            setIsShutterOpen(updatedState);
        } catch (err) {
            console.error("Erro ao alternar a persiana:", err);
            setError("Falha ao alternar a persiana.");
        }
    };

    const updateOpenPercentage = async (newPercentage) => {
        try {
            const percentageNumber = Number(newPercentage);
            setOpenPercentage(percentageNumber);

            if (isShutterOpen) {
                await saveStateToDatabase(true, percentageNumber);
            }
        } catch (err) {
            console.error("Erro ao atualizar a percentagem de abertura:", err);
            setError("Falha ao atualizar a percentagem de abertura.");
        }
    };

    const saveStateToDatabase = async (state, percentage) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, openPercentage: percentage }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            console.log("State and percentage saved successfully:", { state, percentage });
        } catch (err) {
            console.error("Erro ao salvar estado e percentagem na base de dados:", err);
            setError("Falha ao salvar estado e percentagem na base de dados.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Shutter</span>
            </div>

            {/* State Control */}
            <StateControl isShutterOpen={isShutterOpen} toggleShutter={toggleShutter} />

            {/* Percentage Control */}
            <PercentageControl
                isShutterOpen={isShutterOpen}
                openPercentage={openPercentage}
                updateOpenPercentage={updateOpenPercentage}
            />

            {/* Automatization Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeShutter deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}