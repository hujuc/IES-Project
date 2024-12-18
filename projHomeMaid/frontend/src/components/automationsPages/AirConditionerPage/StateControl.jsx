import React, { useState, useEffect } from "react";
import hotIcon from "../../../assets/automationsPages/stateIcons/airConditioner/sun.png";
import coldIcon from "../../../assets/automationsPages/stateIcons/airConditioner/cold.png";
import airIcon from "../../../assets/automationsPages/stateIcons/airConditioner/air.png";
import humidIcon from "../../../assets/automationsPages/stateIcons/airConditioner/humid.png";
import { useNavigate } from "react-router-dom"; // For redirecting to login

export default function StateControl({ deviceId, deviceData }) {
    const [state, setState] = useState(deviceData.state);
    const [temperature, setTemperature] = useState(deviceData.temperature || 24);
    const [airFluxRate, setAirFluxRate] = useState(deviceData.airFluxRate || "medium");
    const [airFluxDirection, setAirFluxDirection] = useState(deviceData.airFluxDirection || "up");
    const [selectedMode, setSelectedMode] = useState(deviceData.mode || "hot");
    const [isDisabled, setIsDisabled] = useState(!deviceData.state);
    const navigate = useNavigate();

    const directions = ["up", "down"];
    const rates = ["low", "medium", "high"];
    const modes = [
        { name: "hot", icon: hotIcon },
        { name: "cold", icon: coldIcon },
        { name: "air", icon: airIcon },
        { name: "humid", icon: humidIcon },
    ];

    useEffect(() => {
        setState(deviceData.state);
        setTemperature(deviceData.temperature || 24);
        setAirFluxRate(deviceData.airFluxRate || "medium");
        setAirFluxDirection(deviceData.airFluxDirection || "up");
        setSelectedMode(deviceData.mode || "hot");
        setIsDisabled(!deviceData.state);
    }, [deviceData]);

    const toggleAirConditioner = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const updatedState = !state;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state: updatedState }),
            });

            if (response.ok) {
                setState(updatedState);
                setIsDisabled(!updatedState);
            } else {
                console.error("Failed to update state:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating state:", error);
        }
    };

    const updateTemperature = async (newTemperature) => {
        if (newTemperature < 12 || newTemperature > 32) return;

        setTemperature(newTemperature);

        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ temperature: newTemperature }),
            });
        } catch (error) {
            console.error("Error updating temperature:", error);
        }
    };

    const handleModeChange = async (mode) => {
        setSelectedMode(mode);

        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ mode }),
            });
        } catch (error) {
            console.error("Error updating mode:", error);
        }
    };

    const updateAirFluxRate = async (direction) => {
        const currentIndex = rates.indexOf(airFluxRate);
        const newIndex =
            direction === "prev"
                ? (currentIndex - 1 + rates.length) % rates.length
                : (currentIndex + 1) % rates.length;
        const newRate = rates[newIndex];
        setAirFluxRate(newRate);

        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ airFluxRate: newRate }),
            });
        } catch (error) {
            console.error("Error updating air flux rate:", error);
        }
    };

    const updateAirFluxDirection = async (direction) => {
        const currentIndex = directions.indexOf(airFluxDirection);
        const newIndex =
            direction === "prev"
                ? (currentIndex - 1 + directions.length) % directions.length
                : (currentIndex + 1) % directions.length;
        const newDirection = directions[newIndex];
        setAirFluxDirection(newDirection);

        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ airFluxDirection: newDirection }),
            });
        } catch (error) {
            console.error("Error updating air flux direction:", error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Toggle Switch */}
            <div className="flex items-center justify-center mt-6 gap-2">
                <span className="text-lg font-semibold">
                    {state ? "On" : "Off"}
                </span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={state}
                    onChange={toggleAirConditioner}
                />
            </div>

            {/* Temperature Control */}
            <div
                className={`mt-6 w-full px-6 ${
                    isDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <div className="flex flex-col items-center bg-white p-6 rounded-lg w-80 h-64 relative">
                    <div className="relative w-64 h-32">
                        <svg
                            viewBox="0 0 100 50"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {[...Array(20)].map((_, i) => (
                                <line
                                    key={i}
                                    x1="50"
                                    y1="5"
                                    x2="50"
                                    y2="15"
                                    stroke="#d1d5db"
                                    strokeWidth="2"
                                    transform={`rotate(${i * 9 - 90} 50 50)`}
                                />
                            ))}
                            {[...Array(Math.floor((temperature - 12) * 20 / 20))].map((_, i) => (
                                <line
                                    key={i}
                                    x1="50"
                                    y1="5"
                                    x2="50"
                                    y2="15"
                                    stroke="#f97316"
                                    strokeWidth="2"
                                    transform={`rotate(${i * 9 - 90} 50 50)`}
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                            <h2 className="text-gray-700 text-sm mb-1">
                                {temperature < 18
                                    ? "Cold"
                                    : temperature < 28
                                        ? "Warm"
                                        : "Hot"}
                            </h2>
                            <h1 className="text-gray-800 text-4xl font-bold">
                                {temperature}
                            </h1>
                            <span className="text-gray-500 text-xs">°Celsius</span>
                        </div>
                        <div className="absolute inset-0 flex justify-between items-center mt-40">
                            <span className="text-gray-500 text-xs">12°C</span>
                            <span className="text-gray-500 text-xs">32°C</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-8 space-x-8">
                        <button
                            className="text-white bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-600 text-3xl"
                            onClick={() => updateTemperature(temperature - 1)}
                        >
                            -
                        </button>
                        <button
                            className="text-white bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-400 text-3xl"
                            onClick={() => updateTemperature(temperature + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Air Flux Control */}
            <div
                className={`mt-6 w-full px-6 ${
                    isDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Mode Selection */}
                    <div className="flex justify-between mb-4">
                        {modes.map((mode) => (
                            <button
                                key={mode.name}
                                onClick={() => handleModeChange(mode.name)}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full ${
                                    selectedMode === mode.name
                                        ? "bg-orange-100 text-orange-500 border-2 border-orange-500"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                <img src={mode.icon} alt={mode.name} className="w-6 h-6 mb-1" />
                                <span className="text-sm">{mode.name.charAt(0).toUpperCase() + mode.name.slice(1)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Air Flux Direction */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 font-semibold">
                            Air flux direction
                        </span>
                        <div className="flex items-center">
                            <button
                                className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                                onClick={() => updateAirFluxDirection("prev")}
                            >
                                &lt;
                            </button>
                            <span className="mx-4 text-gray-700">
                                {airFluxDirection.charAt(0).toUpperCase() + airFluxDirection.slice(1)}
                            </span>
                            <button
                                className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                                onClick={() => updateAirFluxDirection("next")}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                    {/* Air Flux Rate */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 font-semibold">Air flux rate</span>
                        <div className="flex items-center">
                            <button
                                className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                                onClick={() => updateAirFluxRate("prev")}
                            >
                                &lt;
                            </button>
                            <span className="mx-4 text-gray-700">
                                {airFluxRate.charAt(0).toUpperCase() + airFluxRate.slice(1)}
                            </span>
                            <button
                                className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                                onClick={() => updateAirFluxRate("next")}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
