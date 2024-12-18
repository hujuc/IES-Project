import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import AirConditionerState from "../../components/automationsPages/AirConditionerPage/StateControl.jsx";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import AutomatizeAirConditioner from "../../components/automationsPages/AirConditionerPage/AirCondAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom"; 

export default function AirConditionerControl() {
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch device data and set up WebSocket
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.error("Token not found. Redirecting to login.");
            navigate("/login");
            return;
        }

        const fetchDeviceData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDeviceData(data);
                } else if (response.status === 403) {
                    console.error("Unauthorized Access. Redirecting to login.");
                    navigate("/login");
                } else {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching device data:", error);
            } finally {
                setLoading(false);
            }
        };

        const openWebSocket = () => {
            const client = new Client({
                webSocketFactory: () =>
                    new SockJS(
                        `${import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")}?token=${token}`
                    ),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            client.onConnect = () => {
                client.subscribe(`/topic/device-updates`, (message) => {
                    const updatedData = JSON.parse(message.body);

                    // Check if the update is for the current device
                    if (updatedData.deviceId === deviceId) {
                        setDeviceData((prev) => ({
                            ...prev,
                            ...updatedData,
                        }));
                    }
                });
            };

            client.onStompError = (frame) => {
                console.error("WebSocket STOMP error:", frame.headers["message"]);
                console.error("Error details:", frame.body);
            };

            client.activate();

            return () => client.deactivate();
        };

        fetchDeviceData();
        openWebSocket();
    }, [deviceId, navigate]);

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
            {/* Header */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">
                    {deviceData.name || "Air Conditioner"}
                </span>
            </div>

            {/* State and Control Section */}
            <AirConditionerState deviceId={deviceId} deviceData={deviceData} />

            {/* Automation Section */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeAirConditioner deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
