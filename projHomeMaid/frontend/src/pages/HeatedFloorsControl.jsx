import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/heatedFloorsControlPage/StateControl.jsx";
import TemperatureControl from "../components/heatedFloorsControlPage/TemperatureControl.jsx";
import AutomatizeHeatedFloors from "../components/heatedFloorsControlPage/AutomatizeHeatedFloors.jsx";

export default function HeatedFloorsControl() {
    const [isHeatedOn, setIsHeatedOn] = useState(false);
    const [temperature, setTemperature] = useState(20.0);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    const fetchHeatedFloorsData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
            const data = await response.json();

            if (data.state !== undefined) {
                setIsHeatedOn(data.state);
            }

            if (data.temperature !== undefined) {
                setTemperature(data.temperature);
            }
        } catch (err) {
            console.error("Error fetching heated floors state:", err);
            setError("Failed to fetch heated floors state.");
        }
    };

    useEffect(() => {
        fetchHeatedFloorsData();
        const intervalId = setInterval(fetchHeatedFloorsData, 5000);

        return () => clearInterval(intervalId);
    }, [deviceId]);

    const toggleHeatedFloors = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isHeatedOn;

            await saveStateToDatabase(updatedState, updatedState ? temperature : null);

            setIsHeatedOn(updatedState);
        } catch (err) {
            console.error("Error toggling heated floors:", err);
            setError("Failed to toggle heated floors.");
        }
    };

    const updateTemperature = async (newTemperature) => {
        try {
            const tempNumber = Number(newTemperature);
            setTemperature(tempNumber);

            if (isHeatedOn) {
                await saveStateToDatabase(true, tempNumber);
            }
        } catch (err) {
            console.error("Error updating temperature:", err);
            setError("Failed to update temperature.");
        }
    };

    const saveStateToDatabase = async (state, temperature) => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, temperature }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }

            console.log("State and temperature saved successfully:", { state, temperature });
        } catch (err) {
            console.error("Error saving state and temperature to database:", err);
            setError("Failed to save state and temperature to database.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Heated Floors</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            <StateControl isHeatedOn={isHeatedOn} toggleHeatedFloors={toggleHeatedFloors} />
            <TemperatureControl
                isHeatedOn={isHeatedOn}
                temperature={temperature}
                updateTemperature={updateTemperature}
            />

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeHeatedFloors deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
