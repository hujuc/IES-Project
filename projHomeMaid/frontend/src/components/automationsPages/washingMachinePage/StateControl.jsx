import React, { useState, useEffect } from "react";
import washerOnIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png"; // Icon for washer on
import washerOffIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png"; // Icon for washer off
import lowTempIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png"; // Icon for low temperature
import highTempIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png";
import { useNavigate } from "react-router-dom"; // Import for redirecting to login
import { Client } from "@stomp/stompjs"; // Assuming you're using stomp.js for WebSocket client
import SockJS from "sockjs-client"; // SockJS for fallback

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

// Mapeamento de modos
const washModeMapping = {
    "Regular Wash": "regularWash",
    "Gentle Wash": "gentleWash",
    "Deep Clean": "deepClean",
};

const reverseWashModeMapping = {
    regularWash: "Regular Wash",
    gentleWash: "Gentle Wash",
    deepClean: "Deep Clean",
};

export default function StateControl({ deviceId }) {
    const [isRunning, setIsRunning] = useState(false); // To track if the washer is running
    const [currentState, setCurrentState] = useState({
        isWasherOn: false,
        temperature: 40.0,
        washMode: "regularWash", // Default mode in camelCase
    }); // To store the current state of the washer
    const [loading, setLoading] = useState(true); // Track loading state
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch the current state from the backend when the component is mounted
        const fetchCurrentState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`,{
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setCurrentState({
                        isWasherOn: data.state,
                        temperature: data.temperature || 40,
                        washMode: data.mode || "regularWash",
                    });
                    setIsRunning(data.state);
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

        // WebSocket client initialization
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            beforeConnect: () => {
                const token = localStorage.getItem("jwtToken");
                if (token) {
                    client.connectHeaders = {
                        Authorization: `Bearer ${token}`, // Add the token to the WebSocket headers
                    };
                }
            }
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                if (updatedData.deviceId === deviceId) {
                    setCurrentState((prevState) => ({
                        ...prevState,
                        isWasherOn: updatedData.state ?? prevState.isWasherOn,
                        temperature: updatedData.temperature ?? prevState.temperature,
                        washMode: updatedData.mode ?? prevState.washMode,
                    }));
                    setIsRunning(updatedData.state ?? false); // Sync "isRunning" with backend state
                }
            });
        };

        client.activate();

        return () => {
            client.deactivate(); // Cleanup WebSocket on unmount
        };
    }, [deviceId, navigate]);

    const updateDeviceState = async (state, temp = null, mode = null) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            const payload = { state };
            if (temp !== null) payload.temperature = temp;
            if (mode !== null) payload.mode = mode;

            const response = await fetch(`${API_BASE_URL}/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to update device state: ${response.statusText}`);
            }

            const updatedState = await response.json();
            setCurrentState({
                isWasherOn: updatedState.state,
                temperature: updatedState.temperature,
                washMode: updatedState.mode,
            });

            setIsRunning(updatedState.state); // Ensure "isRunning" syncs with the backend state
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

    const handleToggleWasher = async () => {
        const newState = !currentState.isWasherOn;

        setCurrentState((prevState) => ({
            ...prevState,
            isWasherOn: newState,
        }));

        setIsRunning(newState); // Immediately update "isRunning"

        // Update the washer’s state in the backend
        await updateDeviceState(newState, currentState.temperature, currentState.washMode);

        if (newState) {
            // Simulate the cycle with a timeout
            setTimeout(async () => {
                setIsRunning(false);

                // Automatically turn off the washer in the backend after the cycle
                await updateDeviceState(false, currentState.temperature, currentState.washMode);
            }, 120000); // Simulate a 2-minute cycle
        }
    };

    const handleTemperatureChange = async (newTemperature) => {
        const tempValue = Number(newTemperature);
        setCurrentState((prevState) => ({
            ...prevState,
            temperature: tempValue,
        }));

        // Update temperature in the backend
        await updateDeviceState(currentState.isWasherOn, tempValue, currentState.washMode);
    };

    const handleWashModeChange = async (newModeDisplay) => {
        const newModeBackend = washModeMapping[newModeDisplay];
        setCurrentState((prevState) => ({
            ...prevState,
            washMode: newModeBackend,
        }));

        // Update the mode in the backend
        await updateDeviceState(currentState.isWasherOn, currentState.temperature, newModeBackend);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={handleToggleWasher}
                className={`w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative ${
                    isRunning ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isRunning} // Disable button while the cycle is running
            >
                {/* Background */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Washer state icon */}
                <div className="z-10">
                    {currentState.isWasherOn ? (
                        <img src={washerOnIcon} alt="Washer On" className="w-20 h-20" />
                    ) : (
                        <img src={washerOffIcon} alt="Washer Off" className="w-20 h-20" />
                    )}
                </div>
            </button>

            {/* Washer Running Indicator */}
            {isRunning && <p className="text-orange-500 font-semibold mt-2">Washer Running...</p>}

            {/* State toggle */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{currentState.isWasherOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={currentState.isWasherOn}
                    onChange={handleToggleWasher}
                    disabled={isRunning} // Prevent toggling during the cycle
                />
            </div>

            {/* Temperature Control */}
            <div className="mt-6 w-60 text-center">
                <div className="flex justify-between items-center">
                    <img src={lowTempIcon} alt="Low Temperature" className="w-8 h-8" />
                    <input
                        type="range"
                        min="20"
                        max="90"
                        step="1"
                        value={currentState.temperature}
                        onChange={(e) => handleTemperatureChange(e.target.value)}
                        disabled={isRunning}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFA726 ${
                                ((currentState.temperature - 20) / 70) * 100
                            }%, #e5e7eb ${
                                ((currentState.temperature - 20) / 70) * 100
                            }%)`,
                        }}
                    />
                    <img src={highTempIcon} alt="High Temperature" className="w-8 h-8" />
                </div>
                <p className="text-orange-500 font-semibold mt-0">{currentState.temperature.toFixed(0)}°C</p>
            </div>

            {/* Wash Mode Selector */}
            <div className="mt-6 w-60 text-center">
                <label className="text-lg font-medium">Wash Mode</label>
                <select
                    value={reverseWashModeMapping[currentState.washMode]} // Display mode in readable format
                    onChange={(e) => handleWashModeChange(e.target.value)} // Update mode in camelCase
                    disabled={isRunning}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                    {Object.keys(washModeMapping).map((mode) => (
                        <option key={mode} value={mode}>
                            {mode}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
