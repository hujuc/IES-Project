import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/dryerMachinePage/StateControl.jsx";
import AutomatizeDryer from "../../components/automationsPages/dryerMachinePage/DryerAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function DryerMachineControl() {
    const [isDryerOn, setIsDryerOn] = useState(false);
    const [temperature, setTemperature] = useState(50); // Default temperature
    const [dryMode, setDryMode] = useState("Regular Dry"); // Default dry mode
    const [deviceName, setDeviceName] = useState("Dryer Machine"); // Default device name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch data from API
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                setIsDryerOn(data.state || false);
                setTemperature(data.temperature || 50);
                setDryMode(data.mode || "Regular Dry");
                setDeviceName(data.name || "Dryer Machine");
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
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
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
                    if (updatedData.name) setDeviceName(updatedData.name);
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

            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
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

            {/* Título do dispositivo */}
            <div className="w-full text-center px-6 py-4">
                <span className="text-3xl font-semibold">{deviceName}</span>
            </div>

            {/* State Control */}
            <StateControl
                deviceId={deviceId}
                isDryerOn={isDryerOn}
                toggleDryer={toggleDryer}
                temperature={temperature}
                dryMode={dryMode}
            />

            {/* Automatização */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeDryer deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
