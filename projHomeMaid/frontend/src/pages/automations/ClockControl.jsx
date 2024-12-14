import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import ClockCentralControl from "../../components/automationsPages/clockPage/ClockCentralControl.jsx";
import AutomatizeAlarmClock from "../../components/automationsPages/clockPage/AutomatizeAlarmClock.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function ClockControl() {
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    const [deviceName, setDeviceName] = useState("Clock"); // Default name
    const [error, setError] = useState(null);

    // Fetch the initial clock data and setup WebSocket
    useEffect(() => {
        const fetchClockData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                setDeviceName(data.name || "Clock"); // Use the device name from API
            } catch (err) {
                console.error("Error fetching clock data:", err);
                setError("Failed to fetch the clock data.");
            }
        };

        fetchClockData();

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
                    if (updatedData.name) setDeviceName(updatedData.name);
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

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* Central Clock Control */}
            <div className="mt-6">
                <ClockCentralControl deviceId={deviceId} />
            </div>

            {/* Automation Box */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeAlarmClock deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
