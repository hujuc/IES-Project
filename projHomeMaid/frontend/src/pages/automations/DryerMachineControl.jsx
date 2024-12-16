import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/dryerMachinePage/StateControl.jsx";
import AutomatizeDryer from "../../components/automationsPages/dryerMachinePage/DryerAutomation.jsx";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

export default function DryerMachineControl() {
    const [isDryerOn, setIsDryerOn] = useState(false);
    const [temperature, setTemperature] = useState(50);
    const [dryMode, setDryMode] = useState("regularDry");
    const [deviceName, setDeviceName] = useState("Dryer Machine");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    if (response.status === 403) navigate("/login");
                    throw new Error(`Failed to fetch device data: ${response.status}`);
                }

                const data = await response.json();
                setIsDryerOn(data.state || false);
                setTemperature(data.temperature || 50);
                setDryMode(data.mode || "regularDry");
                setDeviceName(data.name || "Dryer Machine");
            } catch (err) {
                setError("Failed to fetch device data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();

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
                    setIsDryerOn(updatedData.state || false);
                    setTemperature(updatedData.temperature || 50);
                    setDryMode(updatedData.mode || "regularDry");
                    setDeviceName(updatedData.name || deviceName);
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId, navigate]);

    const saveStateToDatabase = async (state, temp, mode) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state, temperature: temp, mode }),
            });

            if (!response.ok) throw new Error("Failed to save state.");
        } catch (err) {
            setError("Failed to save state.");
        }
    };

    const toggleDryer = async (state) => {
        setIsDryerOn(state);
        await saveStateToDatabase(state, temperature, dryMode);
    };

    const updateTemperature = async (temp) => {
        setTemperature(temp);
        if (isDryerOn) await saveStateToDatabase(isDryerOn, temp, dryMode);
    };

    const updateDryMode = async (mode) => {
        setDryMode(mode);
        if (isDryerOn) await saveStateToDatabase(isDryerOn, temperature, mode);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            <AutomationsHeader />
            <div className="w-full text-center px-6 py-4">
                <span className="text-3xl font-semibold">{deviceName}</span>
            </div>
            <StateControl
                isDryerOn={isDryerOn}
                toggleDryer={toggleDryer}
                temperature={temperature}
                updateTemperature={updateTemperature}
                dryMode={dryMode}
                updateDryMode={updateDryMode}
                isRunning={isDryerOn}
            />
            <AutomationBox deviceId={deviceId}>
                <AutomatizeDryer deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
