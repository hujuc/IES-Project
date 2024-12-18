import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/shutterControlPage/StateControl.jsx";
import ShutterAutomation from "../../components/automationsPages/shutterControlPage/shutterAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function ShutterControl() {
    const DEFAULT_OPEN_PERCENTAGE = 100;
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(DEFAULT_OPEN_PERCENTAGE);
    const [deviceName, setDeviceName] = useState("Shutter");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const url = window.location.href;
    const deviceId = url.split("/").pop();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchShutterData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setDeviceName(data.name || "Shutter");
                    setIsShutterOpen(data.state || false);
                    setOpenPercentage(data.openPercentage != null ? Number(data.openPercentage) : DEFAULT_OPEN_PERCENTAGE);
                } else if (response.status === 403) {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error fetching shutter data:", err);
                setError("Failed to fetch shutter data.");
            }
        };

        fetchShutterData();

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
                    if (updatedData.state !== undefined) setIsShutterOpen(updatedData.state);
                    if (updatedData.openPercentage !== undefined) setOpenPercentage(updatedData.openPercentage);
                    if (updatedData.name) setDeviceName(updatedData.name);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Details:", frame.body);
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId, navigate]);

    const saveStateToDatabase = async (state, percentage) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state, openPercentage: percentage }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    navigate("/login");
                }
                throw new Error("Error saving state to database");
            }
        } catch (err) {
            console.error("Error saving state and percentage to database:", err);
            setError("Failed to save state and percentage to database.");
        }
    };

    const toggleShutter = async () => {
        try {
            const updatedState = !isShutterOpen;
            const percentage = updatedState ? DEFAULT_OPEN_PERCENTAGE : 0;
            setIsShutterOpen(updatedState);
            setOpenPercentage(percentage);
            await saveStateToDatabase(updatedState, percentage);
        } catch (err) {
            console.error("Error toggling shutter:", err);
            setError("Failed to toggle shutter.");
        }
    };

    const updateOpenPercentage = async (newPercentage) => {
        try {
            const percentage = Number(newPercentage);
            setOpenPercentage(percentage);
            if (isShutterOpen) {
                await saveStateToDatabase(true, percentage);
            }
        } catch (err) {
            console.error("Error updating open percentage:", err);
            setError("Failed to update open percentage.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar */}
            <AutomationsHeader />

            {/* Device Title */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            <StateControl
                isShutterOpen={isShutterOpen}
                openPercentage={openPercentage}
                toggleShutter={toggleShutter}
                updateOpenPercentage={updateOpenPercentage}
            />

            {/* Automation Controls */}
            <AutomationBox deviceId={deviceId}>
                <ShutterAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
