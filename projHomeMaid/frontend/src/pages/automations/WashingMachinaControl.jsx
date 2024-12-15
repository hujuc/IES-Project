    import React, { useState, useEffect } from "react";
    import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
    import StateControl from "../../components/automationsPages/washingMachinePage/StateControl.jsx";
    import WasherAutomation from "../../components/automationsPages/washingMachinePage/washerAutomation.jsx";
    import { Client } from "@stomp/stompjs";
    import SockJS from "sockjs-client";
    import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

    export default function WashingMachineControl() {
        const [isWasherOn, setIsWasherOn] = useState(false);
        const [temperature, setTemperature] = useState(40); // Default temperature
        const [washMode, setWashMode] = useState("Regular Wash"); // Default wash mode
        const [deviceName, setDeviceName] = useState("Washing Machine"); // Default device name
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

                    setIsWasherOn(data.state || false);
                    setTemperature(data.temperature || 40);
                    setWashMode(data.mode || "Regular Wash");
                    setDeviceName(data.name || "Washing Machine");
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
                        setIsWasherOn(updatedData.state || false);
                        setTemperature(updatedData.temperature || 40);
                        setWashMode(updatedData.mode || "Regular Wash");
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
                    isWasherOn={isWasherOn}
                    toggleWasher={toggleWasher}
                    temperature={temperature}
                    washMode={washMode}
                />

                {/* Automatização */}
                <AutomationBox deviceId={deviceId}>
                    <WasherAutomation deviceId={deviceId} />
                </AutomationBox>
            </div>
        );
    }
