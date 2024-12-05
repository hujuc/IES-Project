import React, { useState, useEffect } from "react";
import GetBackButton from "../components/AirConditionerPage/GetBackButton.jsx";
import EllipsisButton from "../components/AirConditionerPage/EllipsisButton.jsx";
import TemperatureControl from "../components/AirConditionerPage/TemperatureControl.jsx";
import AirFluxControl from "../components/AirConditionerPage/AirFluxControl.jsx";
import AutomatizeAirConditioner from "../components/AirConditionerPage/AutomatizeAirCond.jsx";

export default function AirConditionerControl() {
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

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

        // Conectar ao WebSocket
        const ws = new WebSocket("ws://localhost:8080/ws/devices");

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.deviceId === deviceId) {
                    setDeviceData((prev) => ({ ...prev, ...message })); // Atualiza os dados do dispositivo em tempo real
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        return () => ws.close(); // Fechar a conexão ao desmontar o componente
    }, [deviceId]);

    const toggleAirConditioner = async () => {
        if (!deviceData) return;

        try {
            const updatedState = !deviceData.state;
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state: updatedState }),
            });

            if (response.ok) {
                setDeviceData((prev) => ({ ...prev, state: updatedState }));
            } else {
                console.error("Failed to update device state:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

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

    const isDisabled = !deviceData.state; // Desativa controles se o estado estiver desligado

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Air Conditioner</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500 mt-2"
                    checked={deviceData.state || false}
                    onChange={toggleAirConditioner} // Permite alternar o estado
                />
            </div>

            {/* Conteúdo bloqueável */}
            <div
                className={`mt-6 w-full px-6 flex flex-col gap-6 ${
                    isDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                {/* Temperature Control */}
                <div className="bg-[#3B342D] p-6 rounded-lg shadow-md">
                    <TemperatureControl
                        deviceId={deviceId}
                        initialTemperature={deviceData.temperature}
                    />
                </div>

                {/* Air Flux Control */}
                <div className="bg-[#3B342D] p-6 rounded-lg shadow-md">
                    <AirFluxControl deviceId={deviceId} deviceData={deviceData} />
                </div>
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeAirConditioner deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
