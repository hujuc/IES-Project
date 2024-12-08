import React, { useState, useEffect } from "react";
import washerOnIcon from "../../assets/washer_aut.png"; // Icon for washer on
import washerOffIcon from "../../assets/washer_aut.png"; // Icon for washer off

const API_BASE_URL = "http://localhost:8080/api/devices";

export default function StateControl({ deviceId, toggleWasher, temperature, washMode }) {
    const [isRunning, setIsRunning] = useState(false);  // To track if the washer is running
    const [currentState, setCurrentState] = useState({
        isWasherOn: false,
        temperature: 40.0,
        washMode: "regular wash"
    }); // To store the current state of the washer
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
                        isWasherOn: data.state,
                        temperature: data.temperature,
                        washMode: data.mode,
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
    }, [deviceId, toggleWasher, temperature, washMode]);

    // Simulate the washing cycle when the washer is turned on
    useEffect(() => {
        if (!loading && currentState.isWasherOn && !isRunning) {
            setIsRunning(true);

            // Update the washer’s state to "on" in the backend
            updateDeviceState(true, currentState.temperature, currentState.washMode);

            // Simulate the cycle by using a timeout
            const timer = setTimeout(() => {
                setIsRunning(false); // Set isRunning to false when cycle ends

                // Update the washer’s state to "off" in the database
                updateDeviceState(false, null, null);

                toggleWasher(false); // Update the frontend state to match
            }, 120000); // 2-minute cycle simulation

            return () => clearTimeout(timer); // Cleanup the timer when component unmounts
        }
    }, [currentState.isWasherOn, loading]);

    // Update the device state in the backend (e.g., when the washer starts/stops)
    const updateDeviceState = async (state, temp, mode) => {
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
                onClick={() => toggleWasher(!currentState.isWasherOn)}
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
                    onChange={() => toggleWasher(!currentState.isWasherOn)}
                    disabled={isRunning} // Prevent toggling during the cycle
                />
            </div>
        </div>
    );
}
