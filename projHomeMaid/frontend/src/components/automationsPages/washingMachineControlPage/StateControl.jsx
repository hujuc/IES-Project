import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import washerOnIcon from "../../../assets/washer_aut.png"; // Icon for washer on
import washerOffIcon from "../../../assets/washer_aut.png"; // Icon for washer off

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

export default function StateControl({ deviceId }) {
    const [isRunning, setIsRunning] = useState(false); // To track if the washer is running
    const [currentState, setCurrentState] = useState({
        isWasherOn: false,
        temperature: 40.0,
        washMode: "Regular Wash",
    }); // To store the current state of the washer
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Fetch the current state from the backend when the component is mounted
        const fetchCurrentState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    setCurrentState({
                        isWasherOn: data.state,
                        temperature: data.temperature || 40,
                        washMode: data.mode || "Regular Wash",
                    });
                    setIsRunning(data.state); // Sync "isRunning" with the current state
                } else {
                    console.error("Failed to fetch device state:", data);
                }
            } catch (error) {
                console.error("Error fetching device state:", error);
            } finally {
                setLoading(false); // Set loading to false once fetch is complete
            }
        };

        fetchCurrentState();

        // Set up WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket for Washer updates!");

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
                    console.log("Updated washer state received via WebSocket:", updatedData);
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    const updateDeviceState = async (state, temp = null, mode = null) => {
        try {
            const payload = { state };
            if (temp !== null) payload.temperature = temp;
            if (mode !== null) payload.washMode = mode;

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
                isWasherOn: updatedState.state,
                temperature: updatedState.temperature,
                washMode: updatedState.mode,
            });

            setIsRunning(updatedState.state); // Ensure "isRunning" syncs with the backend state
            console.log("Device state updated successfully:", updatedState);
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
        await updateDeviceState(newState, newState ? currentState.temperature : null, newState ? currentState.washMode : null);

        if (newState) {
            // Simulate the cycle with a timeout
            setTimeout(async () => {
                setIsRunning(false);

                // Automatically turn off the washer in the backend after the cycle
                await updateDeviceState(false, null, null);

                // Fetch the latest state to ensure synchronization
                try {
                    const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                    const data = await response.json();

                    if (response.ok) {
                        setCurrentState({
                            isWasherOn: data.state,
                            temperature: data.temperature || 40,
                            washMode: data.mode || "Regular Wash",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching updated state:", error);
                }
            }, 12000); // Simulate a 2-minute cycle
        }
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
        </div>
    );
}
