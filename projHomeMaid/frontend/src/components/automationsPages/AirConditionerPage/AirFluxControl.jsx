import React, { useState, useEffect } from "react";
import hotIcon from "../../../assets/sun.png";
import coldIcon from "../../../assets/cold.png";
import airIcon from "../../../assets/air.png";
import humidIcon from "../../../assets/humid.png";

export default function AirFluxControl({ deviceId }) {
    const [selectedMode, setSelectedMode] = useState(null);
    const [airFluxDirection, setAirFluxDirection] = useState(null);
    const [airFluxRate, setAirFluxRate] = useState(null);

    const directions = ["up", "down"];
    const rates = ["low", "medium", "high"];
    const modes = [
        { name: "hot", icon: hotIcon },
        { name: "cold", icon: coldIcon },
        { name: "air", icon: airIcon },
        { name: "humid", icon: humidIcon },
    ];

    useEffect(() => {
        // Fetch initial device data
        fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`)
            .then((response) => response.json())
            .then((data) => {
                setSelectedMode(data.mode || "hot");
                setAirFluxDirection(data.airFluxDirection || "up");
                setAirFluxRate(data.airFluxRate || "medium");
            })
            .catch((error) =>
                console.error("Error fetching AirFluxControl data:", error)
            );
    }, [deviceId]);

    const updateAirFluxControl = (newState) => {
        fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newState),
        })
            .then((response) => response.json())
            .then((data) => {
            })
            .catch((error) =>
                console.error("Error updating AirFluxControl:", error)
            );
    };

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
        updateAirFluxControl({ mode });
    };

    const handleDirectionChange = (direction) => {
        const currentIndex = directions.indexOf(airFluxDirection);
        const newIndex = direction === "prev" ? (currentIndex - 1 + directions.length) % directions.length : (currentIndex + 1) % directions.length;
        const newDirection = directions[newIndex];
        setAirFluxDirection(newDirection);
        updateAirFluxControl({ airFluxDirection: newDirection });
    };

    const handleRateChange = (direction) => {
        const currentIndex = rates.indexOf(airFluxRate);
        const newIndex = direction === "prev" ? (currentIndex - 1 + rates.length) % rates.length : (currentIndex + 1) % rates.length;
        const newRate = rates[newIndex];
        setAirFluxRate(newRate);
        updateAirFluxControl({ airFluxRate: newRate });
    };

    if (
        selectedMode === null ||
        airFluxDirection === null ||
        airFluxRate === null
    ) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-gray-700">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg w-80 shadow-md">
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
                        onClick={() => handleDirectionChange("prev")}
                    >
                        &lt;
                    </button>
                    <span className="mx-4 text-gray-700">
                        {airFluxDirection.charAt(0).toUpperCase() + airFluxDirection.slice(1)}
                    </span>
                    <button
                        className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                        onClick={() => handleDirectionChange("next")}
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
                        onClick={() => handleRateChange("prev")}
                    >
                        &lt;
                    </button>
                    <span className="mx-4 text-gray-700">
                        {airFluxRate.charAt(0).toUpperCase() + airFluxRate.slice(1)}
                    </span>
                    <button
                        className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                        onClick={() => handleRateChange("next")}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
