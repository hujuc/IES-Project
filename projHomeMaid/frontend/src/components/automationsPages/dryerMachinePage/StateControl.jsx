import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import dryerOnIcon from "../../../assets/automationsPages/devices/dryer/dryerAut.png"; // Icon for dryer on
import dryerOffIcon from "../../../assets/automationsPages/devices/dryer/dryerAut.png"; // Icon for dryer off
import lowTempIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png"; // Icon for low temperature
import highTempIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png"; // Icon for high temperature

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

export default function StateControl({ deviceId }) {
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 50.0,
        dryMode: "Normal Dry",
    }); // State of the dryer
    const [isRunning, setIsRunning] = useState(false); // Track if dryer is running
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Fetch the current state of the dryer
        const fetchCurrentState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    setCurrentState({
                        isDryerOn: data.state,
                        temperature: data.temperature || 50,
                        dryMode: data.mode || "Normal Dry",
                    });
                    setIsRunning(data.state); // Sync "isRunning" with dryer state
                } else {
                    console.error("Failed to fetch device state:", data);
                }
            } catch (error) {
                console.error("Error fetching device state:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentState();

        // Setup WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket for Dryer updates!");

            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                if (updatedData.deviceId === deviceId) {
                    setCurrentState((prevState) => ({
                        ...prevState,
                        isDryerOn: updatedData.state,
                        temperature: updatedData.temperature,
                        dryMode: updatedData.mode,
                    }));
                    setIsRunning(updatedData.state); // Sync running state
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    const updateDeviceState = async (state, temp = null) => {
        try {
            const payload = { state };
            if (temp !== null) payload.temperature = temp;

            const response = await fetch(`${API_BASE_URL}/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to update device state: ${response.statusText}`);
            }

            const updatedState = await response.json();
            setCurrentState({
                isDryerOn: updatedState.state,
                temperature: updatedState.temperature,
                dryMode: updatedState.mode,
            });
            setIsRunning(updatedState.state);
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

    const handleToggleDryer = async () => {
        const newState = !currentState.isDryerOn;

        setCurrentState((prevState) => ({
            ...prevState,
            isDryerOn: newState,
        }));

        setIsRunning(newState);

        await updateDeviceState(newState, newState ? currentState.temperature : null);

        if (newState) {
            setTimeout(() => {
                setIsRunning(false);
                updateDeviceState(false, null);
            }, 120000); // Simulate a 2-minute cycle
        }
    };

    const updateTemperature = async (newTemperature) => {
        setCurrentState((prevState) => ({
            ...prevState,
            temperature: newTemperature,
        }));

        if (!currentState.isDryerOn) {
            await updateDeviceState(false, newTemperature);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center mt-6">
            {/* Dryer Control */}
            <button
                onClick={handleToggleDryer}
                className={`w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative ${
                    isRunning ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isRunning}
            >
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                <div className="z-10">
                    {currentState.isDryerOn ? (
                        <img src={dryerOnIcon} alt="Dryer On" className="w-20 h-20" />
                    ) : (
                        <img src={dryerOffIcon} alt="Dryer Off" className="w-20 h-20" />
                    )}
                </div>
            </button>
            {isRunning && <p className="text-orange-500 font-semibold mt-2">Dryer Running...</p>}

            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{currentState.isDryerOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={currentState.isDryerOn}
                    onChange={handleToggleDryer}
                    disabled={isRunning}
                />
            </div>

            {/* Temperature Control */}
            <div className={`mt-6 w-60 text-center ${isRunning ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="flex justify-between items-center">
                    <img src={lowTempIcon} alt="Low Temperature" className="w-8 h-8" />
                    <input
                        type="range"
                        min="50"
                        max="90"
                        step="1"
                        value={currentState.temperature}
                        onChange={(e) => updateTemperature(parseFloat(e.target.value))}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFA726 ${
                                ((currentState.temperature - 50) / 40) * 100
                            }%, #e5e7eb ${
                                ((currentState.temperature - 50) / 40) * 100
                            }%)`,
                        }}
                    />
                    <img src={highTempIcon} alt="High Temperature" className="w-8 h-8" />
                </div>
                <p className="text-orange-500 font-semibold mt-0">{currentState.temperature.toFixed(0)}°C</p>
            </div>
        </div>
    );
}
