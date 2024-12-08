import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/GetBackButton.jsx";
import StateControl from "../components/dryerMachineControlPage/StateControl.jsx";
import TemperatureControl from "../components/dryerMachineControlPage/TemperatureControl.jsx";
import AutomatizeDryer from "../components/dryerMachineControlPage/AutomatizeDryer.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function DryerMachineControl() {
    const [isDryerOn, setIsDryerOn] = useState(false);
    const [temperature, setTemperature] = useState(50); // Default temperature
    const [dryMode, setDryMode] = useState("Regular Dry"); // Default dry mode
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

                setIsDryerOn(data.state || false);
                setTemperature(data.temperature || 50);
                setDryMode(data.mode || "Regular Dry");
            } catch (err) {
                console.error("Error fetching device data:", err);
                setError("Failed to fetch dryer machine data.");
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
                    setIsDryerOn(updatedData.state || false);
                    setTemperature(updatedData.temperature || 50);
                    setDryMode(updatedData.mode || "Regular Dry");
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

    const toggleDryer = async (state) => {
        try {
            setIsDryerOn(state);

            await saveStateToDatabase(state, temperature, dryMode);
        } catch (err) {
            console.error("Error toggling dryer:", err);
            setError("Failed to toggle dryer machine.");
        }
    };

    const updateTemperature = async (newTemperature) => {
        try {
            const tempValue = Number(newTemperature);
            setTemperature(tempValue);

            if (isDryerOn) {
                await saveStateToDatabase(isDryerOn, tempValue, dryMode);
            }
        } catch (err) {
            console.error("Error updating temperature:", err);
            setError("Failed to update temperature.");
        }
    };

    const updateDryMode = async (newMode) => {
        try {
            setDryMode(newMode);

            if (isDryerOn) {
                await saveStateToDatabase(isDryerOn, temperature, newMode);
            }
        } catch (err) {
            console.error("Error updating dry mode:", err);
            setError("Failed to update dry mode.");
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
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Dryer Machine</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* State Control */}
            <StateControl
                deviceId={deviceId}
                isDryerOn={isDryerOn}
                toggleDryer={toggleDryer}
                temperature={temperature}
                dryMode={dryMode}
            />

            {/* Temperature Control */}
            <TemperatureControl
                isDryerOn={isDryerOn}
                temperature={temperature}
                updateTemperature={updateTemperature}
            />

            {/* Dry Mode Selector */}
            <div className={`mt-8 w-60 text-center ${isDryerOn ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="text-lg font-medium">Dry Mode</label>
                <select
                    value={dryMode}
                    onChange={(e) => updateDryMode(e.target.value)}
                    disabled={isDryerOn}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="Regular Dry">Regular Dry</option>
                    <option value="Gentle Dry">Gentle Dry</option>
                    <option value="Permanent Press">Permanent Press</option>
                </select>
            </div>

            {/* Automatization Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md">
                    <AutomatizeDryer deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
