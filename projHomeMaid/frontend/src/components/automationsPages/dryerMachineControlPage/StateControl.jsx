import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import dryerOnIcon from "../../../assets/washer_aut.png"; // Icon for dryer on
import dryerOffIcon from "../../../assets/washer_aut.png"; // Icon for dryer off

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

export default function StateControl({ deviceId }) {
    const [isRunning, setIsRunning] = useState(false); // To track if the dryer is running
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 50.0,
        dryMode: "Normal Dry",
    }); // To store the current state of the dryer
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Fetch current state from backend
        const fetchCurrentState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    setCurrentState({
                        isDryerOn: data.state,
                        temperature: data.temperature,
                        dryMode: data.mode,
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
                    setIsRunning(updatedData.state); // Sync "isRunning" with updates from the backend
                    console.log("Updated dryer state received via WebSocket:", updatedData);
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
            if (mode !== null) payload.dryMode = mode;

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

            setIsRunning(updatedState.state); // Ensure "isRunning" syncs with the backend state
            console.log("Device state updated successfully:", updatedState);
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

        setIsRunning(newState); // Immediately update "isRunning"

        // Update the dryer’s state in the backend
        await updateDeviceState(newState, newState ? currentState.temperature : null, newState ? currentState.dryMode : null);

        if (newState) {
            // Simulate the cycle with a timeout
            setTimeout(() => {
                setIsRunning(false);

                // Automatically turn off the dryer in the backend after the cycle
                updateDeviceState(false, null, null);
            }, 120000); // 1-minute cycle simulation
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={handleToggleDryer}
                className={`w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative ${
                    isRunning ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isRunning} // Disable button while the cycle is running
            >
                {/* Background */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Dryer state icon */}
                <div className="z-10">
                    {currentState.isDryerOn ? (
                        <img src={dryerOnIcon} alt="Dryer On" className="w-20 h-20" />
                    ) : (
                        <img src={dryerOffIcon} alt="Dryer Off" className="w-20 h-20" />
                    )}
                </div>
            </button>

            {/* Dryer Running Indicator */}
            {isRunning && <p className="text-orange-500 font-semibold mt-2">Dryer Running...</p>}

            {/* State toggle */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{currentState.isDryerOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={currentState.isDryerOn}
                    onChange={handleToggleDryer}
                    disabled={isRunning} // Prevent toggling during the cycle
                />
            </div>
        </div>
    );
}
