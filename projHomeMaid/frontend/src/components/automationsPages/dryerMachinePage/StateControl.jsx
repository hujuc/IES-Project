import React, { useState, useEffect } from "react";
import dryerOnIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png"; // Icon for dryer on
import dryerOffIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png"; // Icon for dryer off
import lowTempIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png"; // Icon for low temperature
import highTempIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

// Utility functions to handle mode conversion
const formatModeToDisplay = (mode) =>
    mode.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()); // Converts camelCase to "Title Case"

const formatModeToBackend = (mode) =>
    mode.replace(/ /g, "").replace(/^./, (str) => str.toLowerCase()); // Converts "Title Case" to camelCase

export default function StateControl({ deviceId }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 50.0,
        mode: "regularDry", // Default mode in camelCase
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
                        mode: data.mode,
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
    }, [deviceId]);

    const updateDeviceState = async (newState) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newState),
            });

            if (!response.ok) {
                throw new Error(`Failed to update device state: ${response.statusText}`);
            }

            const updatedState = await response.json();
            setCurrentState({
                isDryerOn: updatedState.state,
                temperature: updatedState.temperature,
                mode: updatedState.mode,
            });

            setIsRunning(updatedState.state); // Ensure "isRunning" syncs with the backend state
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
        await updateDeviceState({
            state: newState,
            temperature: currentState.temperature,
            mode: currentState.mode,
        });

        if (newState) {
            // Simulate the cycle with a timeout
            setTimeout(() => {
                setIsRunning(false);

                // Automatically turn off the dryer in the backend
                updateDeviceState({
                    state: false,
                    temperature: currentState.temperature,
                    mode: currentState.mode,
                });
            }, 120000); // 2-minute cycle simulation
        }
    };

    const handleModeChange = async (newModeDisplay) => {
        const newModeBackend = formatModeToBackend(newModeDisplay);
        setCurrentState((prevState) => ({
            ...prevState,
            mode: newModeBackend,
        }));

        // Update the mode in the backend
        await updateDeviceState({
            state: currentState.isDryerOn,
            temperature: currentState.temperature,
            mode: newModeBackend,
        });
    };

    const handleTemperatureChange = async (newTemperature) => {
        const tempValue = Number(newTemperature);
        setCurrentState((prevState) => ({
            ...prevState,
            temperature: tempValue,
        }));

        // Update temperature in the backend
        await updateDeviceState({
            state: currentState.isDryerOn,
            temperature: tempValue,
            mode: currentState.mode,
        });
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
                disabled={isRunning}
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
                    disabled={isRunning}
                />
            </div>

            {/* Temperature Control */}
            <div className="mt-6 w-60 text-center">
                <div className="flex justify-between items-center">
                    <img src={lowTempIcon} alt="Low Temperature" className="w-8 h-8" />
                    <input
                        type="range"
                        min="50"
                        max="90"
                        step="1"
                        value={currentState.temperature}
                        onChange={(e) => handleTemperatureChange(e.target.value)}
                        disabled={isRunning}
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

            {/* Dry Mode Selector */}
            <div className={`mt-6 w-60 text-center`}>
                <label className="text-lg font-medium">Dry Mode</label>
                <select
                    value={formatModeToDisplay(currentState.mode)} // Display mode in "Title Case"
                    onChange={(e) => handleModeChange(e.target.value)} // Convert to camelCase for backend
                    disabled={isRunning}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                    <option value="Regular Dry">Regular Dry</option>
                    <option value="Gentle Dry">Gentle Dry</option>
                    <option value="Permanent Press">Permanent Press</option>
                </select>
            </div>
        </div>
    );
}
