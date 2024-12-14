import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import CentralControl from "../../components/automationsPages/coffeeMachinePage/CentralControl.jsx";
import DrinkOptions from "../../components/automationsPages/coffeeMachinePage/DrinkOptions.jsx";
import AutomatizeCoffee from "../../components/automationsPages/coffeeMachinePage/AutomatizeCoffee.jsx";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function CoffeeMachineControl() {
    const { deviceId } = useParams(); // Extract deviceId from the URL
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            reconnectDelay: 5000, // Automatically reconnect after 5 seconds if disconnected
            heartbeatIncoming: 4000, // Check server every 4 seconds
            heartbeatOutgoing: 4000, // Notify server every 4 seconds that client is alive
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            // Subscribing to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    setDeviceData((prev) => ({ ...prev, ...updatedData }));
                    console.log("Data updated in frontend:", updatedData);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Close connection when the component unmounts
    }, [deviceId]);

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

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar with AutomationsHeader */}
            <AutomationsHeader />

            {/* Coffee Machine Title */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceData.name || "Coffee Machine"}</span>
            </div>

            {/* Central Control */}
            <div className="mt-8">
                <CentralControl deviceId={deviceId} deviceData={deviceData} />
            </div>

            {/* Drink Options */}
            <div className="mt-8">
                <DrinkOptions deviceId={deviceId} deviceData={deviceData} />
            </div>

            <AutomationBox deviceId={deviceId}>
                <AutomatizeCoffee deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
