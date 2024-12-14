import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import TemperatureControl from "../../components/automationsPages/AirConditionerPage/TemperatureControl.jsx";
import AirFluxControl from "../../components/automationsPages/AirConditionerPage/AirFluxControl.jsx";
import AutomatizeAirConditioner from "../../components/automationsPages/AirConditionerPage/AutomatizeAirCond.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

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
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();
                setDeviceData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
            }
        };

        fetchDeviceData();

        // Connect to WebSocket with SockJS
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
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    setDeviceData((prev) => ({ ...prev, ...updatedData }));
                    console.log("Updated data in frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Disconnect when component unmounts
    }, [deviceId]);

    const toggleAirConditioner = async () => {
        if (!deviceData) return;

        try {
            const updatedState = !deviceData.state;
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
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

    const isDisabled = !deviceData.state; // Disable controls if the device is off

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceData.name || "Air Conditioner"}</span>
            </div>

            {/* Toggle Switch Section */}
            <div className="flex items-center justify-center mt-6 gap-2">
                {/* Display "On" or "Off" text dynamically */}
                <span className="text-lg font-semibold">
                    {deviceData.state ? "On" : "Off"}
                </span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={deviceData.state || false}
                    onChange={toggleAirConditioner} // Toggle state
                />
            </div>

            {/* Blockable Content */}
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

            {/* Automation Box */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeAirConditioner deviceId={deviceId}/>
            </AutomationBox>
        </div>
    );
}
