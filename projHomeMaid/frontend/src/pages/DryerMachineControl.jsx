import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/dryerMachineControlPage/StateControl.jsx";
import TemperatureControl from "../components/dryerMachineControlPage/TemperatureControl.jsx";
import AutomatizeDryer from "../components/dryerMachineControlPage/AutomatizeDryer.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/automations";

export default function DryerMachineControl() {
    const [isDryerOn, setIsDryerOn] = useState(false);
    const [temperature, setTemperature] = useState(50); // Default temperature
    const [dryMode, setDryMode] = useState("Normal Dry"); // Default dry mode
    const [loading, setLoading] = useState(true); // Track loading state

    const url = window.location.href;
    const deviceId = url.split("/").pop(); // Get deviceId from URL

    useEffect(() => {
        // Fetch the current state of the dryer machine when the component is loaded
        const fetchDeviceState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`);
                const data = await response.json();

                if (response.ok) {
                    // Set the state based on the fetched data
                    setIsDryerOn(data.state);
                    setTemperature(data.temperature);
                    setDryMode(data.mode);
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

    const toggleDryer = (newState) => {
        setIsDryerOn(newState);
    };

    const handleCycleComplete = () => {
        // Handle the completion of the drying cycle
        console.log("Drying cycle completed.");
        setIsDryerOn(false);
    };

    const updateTemperature = (newTemperature) => {
        setTemperature(newTemperature);
    };

    const updateDryMode = (newMode) => {
        setDryMode(newMode);
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
                <span className="text-3xl font-semibold">Dryer Machine</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            <div className="mt-8">
                <StateControl
                    deviceId={deviceId}
                    isDryerOn={isDryerOn}
                    toggleDryer={toggleDryer}
                    onCycleComplete={handleCycleComplete}
                    temperature={temperature}
                    dryMode={dryMode}
                />
            </div>

            <div className="mt-8">
                <TemperatureControl
                    isDryerOn={isDryerOn}
                    temperature={temperature}
                    updateTemperature={updateTemperature}
                />
            </div>

            <div className="mt-8 w-60 text-center">
                <label className="text-lg font-medium">Dry Mode</label>
                <select
                    value={dryMode}
                    onChange={(e) => updateDryMode(e.target.value)}
                    disabled={isDryerOn}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="Normal Dry">Normal Dry</option>
                    <option value="Delicate Dry">Delicate Dry</option>
                    <option value="Heavy Dry">Heavy Dry</option>
                </select>
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeDryer deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
