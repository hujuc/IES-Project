import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/washingMachineControlPage/StateControl.jsx";
import TemperatureControl from "../components/washingMachineControlPage/TemperatureControl.jsx";
import AutomatizeWasher from "../components/washingMachineControlPage/AutomatizeWasher.jsx";

const API_BASE_URL = "http://localhost:8080/api/devices";

export default function WashingMachineControl() {
    const [isWasherOn, setIsWasherOn] = useState(false);
    const [temperature, setTemperature] = useState(40); // Default temperature
    const [washMode, setWashMode] = useState("Regular Wash"); // Default wash mode
    const [loading, setLoading] = useState(true); // Track loading state

    const url = window.location.href;
    const deviceId = url.split("/").pop(); // Get deviceId from URL

    useEffect(() => {
        // Fetch the current state of the washing machine when the component is loaded
        const fetchDeviceState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    // Set the state based on the fetched data
                    setIsWasherOn(data.state);
                    setTemperature(data.temperature);
                    setWashMode(data.mode);
                } else {
                    console.error("Failed to fetch device state:", data);
                }
            } catch (error) {
                console.error("Error fetching device state:", error);
            } finally {
                setLoading(false); // Set loading to false once fetch is complete
            }
        };

        fetchDeviceState();
    }, [deviceId]); // Only fetch data when deviceId changes

    const toggleWasher = () => {
        // Toggle washer state
        console.log("Toggling washer with mode:", washMode, "and temperature:", temperature);
        setIsWasherOn((prevState) => !prevState);
    };

    const handleCycleComplete = () => {
        // Handle the completion of the washing cycle
        console.log("Washing cycle completed.");
        setIsWasherOn(false);
    };

    const updateTemperature = (newTemperature) => {
        setTemperature(newTemperature);
    };

    const updateWashMode = (newMode) => {
        setWashMode(newMode);
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching
    }

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Washing Machine</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            <div className="mt-8">
                <StateControl
                    deviceId={deviceId}
                    isWasherOn={isWasherOn}
                    toggleWasher={toggleWasher}
                    onCycleComplete={handleCycleComplete}
                    temperature={temperature}
                    washMode={washMode}
                />
            </div>

            <div className="mt-8">
                <TemperatureControl
                    isWasherOn={isWasherOn}
                    temperature={temperature}
                    updateTemperature={updateTemperature}
                />
            </div>

            <div className="mt-8 w-60 text-center">
                <label className="text-lg font-medium">Wash Mode</label>
                <select
                    value={washMode}
                    onChange={(e) => updateWashMode(e.target.value)}
                    disabled={isWasherOn}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="Regular Wash">Regular Wash</option>
                    <option value="Gentle Wash">Gentle Wash</option>
                    <option value="Deep Clean">Deep Clean</option>
                </select>
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeWasher deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
