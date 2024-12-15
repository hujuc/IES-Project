import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/dryerMachinePage/StateControl.jsx";
import DryerAutomation from "../../components/automationsPages/dryerMachinePage/DryerAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function DryerMachineControl() {
    const [loading, setLoading] = useState(true);
    const [deviceName, setDeviceName] = useState(""); // To store the device name
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch device data: ${response.status}`);
                }
                const data = await response.json();
                setDeviceName(data.name || "Dryer Machine"); // Set the device name or use a fallback
            } catch (err) {
                console.error("Error fetching device data:", err);
                setError("Failed to fetch dryer machine data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        // WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");
            // You can add WebSocket logic here if needed
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Cleanup WebSocket connection
    }, [deviceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Device Title */}
            <div className="w-full text-center py-4">
                <span className="text-3xl font-semibold">{deviceName}</span>
            </div>

            {/* State Control */}
            <StateControl deviceId={deviceId} />

            {/* Automatização */}
            <AutomationBox deviceId={deviceId}>
                <DryerAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
