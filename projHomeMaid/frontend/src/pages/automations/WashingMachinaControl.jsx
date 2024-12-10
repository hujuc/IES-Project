import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/washingMachineControlPage/StateControl.jsx";
import TemperatureControl from "../../components/automationsPages/washingMachineControlPage/TemperatureControl.jsx";
import AutomatizeWasher from "../../components/automationsPages/washingMachineControlPage/AutomatizeWasher.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function WashingMachineControl() {
    const [isWasherOn, setIsWasherOn] = useState(false);
    const [temperature, setTemperature] = useState(40); // Default temperature
    const [washMode, setWashMode] = useState("Regular Wash"); // Default wash mode
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch data from API
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                setIsWasherOn(data.state || false);
                setTemperature(data.temperature || 40);
                setWashMode(data.mode || "Regular Wash");
            } catch (err) {
                console.error("Error fetching device data:", err);
                setError("Failed to fetch washing machine data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();

        // WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws/devices"),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    setIsWasherOn(updatedData.state || false);
                    setTemperature(updatedData.temperature || 40);
                    setWashMode(updatedData.mode || "Regular Wash");
                    console.log("Updated data received via WebSocket:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Cleanup WebSocket connection
    }, [deviceId]);

    const toggleWasher = async (state) => {
        try {
            setIsWasherOn(state);

            await saveStateToDatabase(state, temperature, washMode);
        } catch (err) {
            console.error("Error toggling washer:", err);
            setError("Failed to toggle washing machine.");
        }
    };

    const updateTemperature = async (newTemperature) => {
        try {
            const tempValue = Number(newTemperature);
            setTemperature(tempValue);

            if (isWasherOn) {
                await saveStateToDatabase(isWasherOn, tempValue, washMode);
            }
        } catch (err) {
            console.error("Error updating temperature:", err);
            setError("Failed to update temperature.");
        }
    };

    const updateWashMode = async (newMode) => {
        try {
            setWashMode(newMode);

            if (isWasherOn) {
                await saveStateToDatabase(isWasherOn, temperature, newMode);
            }
        } catch (err) {
            console.error("Error updating wash mode:", err);
            setError("Failed to update wash mode.");
        }
    };

    const saveStateToDatabase = async (state, temp, mode) => {
        try {
            const payload = { state, temperature: temp, mode };

            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to update device state: ${response.status}`);
            }

            console.log("Device state saved successfully:", payload);
        } catch (err) {
            console.error("Error saving device state:", err);
            setError("Failed to save device state to database.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* State Control */}
            <StateControl
                deviceId={deviceId}
                isWasherOn={isWasherOn}
                toggleWasher={toggleWasher}
                temperature={temperature}
                washMode={washMode}
            />

            {/* Temperature Control */}
            <TemperatureControl
                isWasherOn={isWasherOn}
                temperature={temperature}
                updateTemperature={updateTemperature}
            />

            {/* Wash Mode Selector */}
            <div className={`mt-8 w-60 text-center ${isWasherOn ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="text-lg font-medium">Wash Mode</label>
                <select
                    value={washMode}
                    onChange={(e) => updateWashMode(e.target.value)}
                    disabled={isWasherOn}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="Regular Wash">Regular Wash</option>
                    <option value="Gentle Wash">Gentle Wash</option>
                    <option value="Deep Clean">Deep Clean</option>
                </select>
            </div>

            {/* Automatization Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md">
                    <AutomatizeWasher deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
