import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/clockPage/StateControl.jsx";
import ClockAutomation from "../../components/automationsPages/clockPage/clockAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import { useNavigate } from "react-router-dom";

export default function ClockControl() {
    const { deviceId } = useParams();
    const [deviceName, setDeviceName] = useState("Clock");
    const [lightOn, setLightOn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!deviceId) {
            console.error("Device ID is missing");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchClockData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDeviceName(data.name || "Clock");
                    setLightOn(data.ringing || false); // Initialize the ringing state
                } else if (response.status === 403) {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error fetching clock data:", err);
            }
        };

        fetchClockData();

        // Set up WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.name) setDeviceName(updatedData.name);
                    if (updatedData.ringing !== undefined) setLightOn(updatedData.ringing);
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId, navigate]);

    const updateDeviceState = async (ringing, state) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ringing, state }),
            });
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar with AutomationsHeader */}
            <AutomationsHeader />

            {/* Title */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* Central Clock Control */}
            <div className="mt-6">
                <StateControl
                    deviceId={deviceId}
                    lightOn={lightOn}
                    setLightOn={setLightOn}
                    updateDeviceState={updateDeviceState}
                />
            </div>

            {/* Automation Box */}
            <AutomationBox deviceId={deviceId}>
                <ClockAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
