import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/shutterControlPage/StateControl.jsx";
import PercentageControl from "../../components/automationsPages/shutterControlPage/PercentageControl.jsx";
import ShutterAutomation from "../../components/automationsPages/shutterControlPage/shutterAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";

export default function ShutterControl() {
    const DEFAULT_OPEN_PERCENTAGE = 100; // Valor padrão ao abrir a persiana
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(DEFAULT_OPEN_PERCENTAGE);
    const [deviceName, setDeviceName] = useState("Shutter");
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    // Fetch initial shutter data and set up WebSocket
    useEffect(() => {
        const fetchShutterData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();

                setDeviceName(data.name || "Shutter");
                setIsShutterOpen(data.state || false);
                setOpenPercentage(data.openPercentage != null ? Number(data.openPercentage) : DEFAULT_OPEN_PERCENTAGE);
            } catch (err) {
                console.error("Error fetching shutter data:", err);
                setError("Failed to fetch shutter data.");
            }
        };

        fetchShutterData();

        // WebSocket setup
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket!");

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

        return () => client.deactivate(); // Cleanup on unmount
    }, [deviceId]);

    // Sync open percentage and shutter state
    useEffect(() => {
        if (openPercentage === 0 && isShutterOpen) {
            saveStateToDatabase(false, 0);
            setIsShutterOpen(false);
        }
    }, [openPercentage, isShutterOpen]);

    const toggleShutter = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isShutterOpen;

            if (updatedState) {
                setOpenPercentage(DEFAULT_OPEN_PERCENTAGE);
                await saveStateToDatabase(updatedState, DEFAULT_OPEN_PERCENTAGE);
            } else {
                setOpenPercentage(0);
                await saveStateToDatabase(updatedState, 0);
            }

            setIsShutterOpen(updatedState);
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

    const saveStateToDatabase = async (state, percentage) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, openPercentage: percentage }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
        } catch (err) {
            console.error("Error saving state and percentage to database:", err);
            setError("Failed to save state and percentage to database.");
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
                deviceId={deviceId}
            />

            {/* Automation Controls */}
            <AutomationBox deviceId={deviceId}>
                <ShutterAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
