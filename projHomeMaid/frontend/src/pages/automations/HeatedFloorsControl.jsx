import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/heatedFloorsControlPage/StateControl.jsx";
import TemperatureControl from "../../components/automationsPages/heatedFloorsControlPage/TemperatureControl.jsx";
import AutomatizeHeatedFloors from "../../components/automationsPages/heatedFloorsControlPage/AutomatizeHeatedFloors.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function HeatedFloorsControl() {
    const [isHeatedOn, setIsHeatedOn] = useState(false);
    const [temperature, setTemperature] = useState(20.0);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    const fetchHeatedFloorsData = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
            const data = await response.json();

            if (data.state !== undefined) {
                setIsHeatedOn(data.state);
            }

            if (data.temperature !== undefined) {
                setTemperature(data.temperature);
            }
        } catch (err) {
            console.error("Error fetching heated floors state:", err);
            setError("Failed to fetch heated floors state.");
        }
    };

    useEffect(() => {
        fetchHeatedFloorsData();

        // Setup WebSocket with SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000, // Retry connection every 5 seconds
            heartbeatIncoming: 4000, // Check server every 4 seconds
            heartbeatOutgoing: 4000, // Inform server every 4 seconds
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            // Subscribe to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsHeatedOn(updatedData.state);
                    if (updatedData.temperature !== undefined) setTemperature(updatedData.temperature);
                    console.log("Updated data in frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Disconnect on component unmount
    }, [deviceId]);

    const toggleHeatedFloors = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isHeatedOn;

            await saveStateToDatabase(updatedState, updatedState ? temperature : null);

            setIsHeatedOn(updatedState);
        } catch (err) {
            console.error("Error toggling heated floors:", err);
            setError("Failed to toggle heated floors.");
        }
    };

    const updateTemperature = async (newTemperature) => {
        try {
            const tempNumber = Number(newTemperature);
            setTemperature(tempNumber);

            if (isHeatedOn) {
                await saveStateToDatabase(true, tempNumber);
            }
        } catch (err) {
            console.error("Error updating temperature:", err);
            setError("Failed to update temperature.");
        }
    };

    const saveStateToDatabase = async (state, temperature) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, temperature }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }

            console.log("State and temperature saved successfully:", { state, temperature });
        } catch (err) {
            console.error("Error saving state and temperature to database:", err);
            setError("Failed to save state and temperature to database.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Heated Floors</span>
            </div>

            <StateControl isHeatedOn={isHeatedOn} toggleHeatedFloors={toggleHeatedFloors} />
            <TemperatureControl
                isHeatedOn={isHeatedOn}
                temperature={temperature}
                updateTemperature={updateTemperature}
            />

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeHeatedFloors deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
