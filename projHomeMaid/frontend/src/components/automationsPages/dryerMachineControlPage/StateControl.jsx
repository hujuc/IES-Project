import React, { useState, useEffect } from "react";
import dryerOnIcon from "../../../assets/washer_aut.png"; // Icon for dryer on
import dryerOffIcon from "../../../assets/washer_aut.png"; // Icon for dryer off

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices"; // Base URL for API requests

export default function StateControl({ deviceId, toggleDryer, temperature, dryMode }) {
    const [isRunning, setIsRunning] = useState(false); // To track if the dryer is running
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 50.0,
        dryMode: "Normal Dry",
    }); // To store the current state of the dryer
    const [loading, setLoading] = useState(true); // Track loading state

    // Fetch the current state from the backend when the component is mounted
    useEffect(() => {
        const fetchCurrentState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    // Set the current state from backend data
                    setCurrentState({
                        isDryerOn: data.state,
                        temperature: data.temperature,
                        dryMode: data.mode,
                    });
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
    }, [deviceId, toggleDryer, temperature, dryMode]);

    // Simulate the drying cycle when the dryer is turned on
    useEffect(() => {
        if (!loading && currentState.isDryerOn && !isRunning) {
            setIsRunning(true);

            // Update the dryer’s state to "on" in the backend
            updateDeviceState(true, currentState.temperature, currentState.dryMode);

            // Simulate the cycle by using a timeout
            const timer = setTimeout(() => {
                setIsRunning(false); // Set isRunning to false when cycle ends

                // Update the dryer’s state to "off" in the database
                updateDeviceState(false, null, null);

                toggleDryer(false); // Update the frontend state to match
            }, 20000); // 2-minute cycle simulation

            return () => clearTimeout(timer); // Cleanup the timer when component unmounts
        }
    }, [currentState.isDryerOn, loading]);

    // Update the device state in the backend (e.g., when the dryer starts/stops)
    const updateDeviceState = async (state, temp, mode) => {
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

            console.log("Device state updated successfully:", payload);
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

    // Show loading state while fetching data
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={() => toggleDryer(!currentState.isDryerOn)}
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
                    onChange={() => toggleDryer(!currentState.isDryerOn)}
                    disabled={isRunning} // Prevent toggling during the cycle
                />
            </div>
        </div>
    );
}
