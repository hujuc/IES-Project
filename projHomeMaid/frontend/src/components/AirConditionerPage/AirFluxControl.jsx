import React, { useState } from "react";

// Import icons from the assets directory
import hotIcon from "../../assets/sun.png";
import coldIcon from "../../assets/cold.png";
import airIcon from "../../assets/air.png";
import humidIcon from "../../assets/humid.png";

export default function AirFluxControl() {
    const [selectedMode, setSelectedMode] = useState("Hot");
    const [airFluxDirection, setAirFluxDirection] = useState("Low");
    const [airFluxRate, setAirFluxRate] = useState("High");

    // Add icons to modes
    const modes = [
        { name: "Hot", icon: hotIcon },
        { name: "Cold", icon: coldIcon },
        { name: "Air", icon: airIcon },
        { name: "Humid", icon: humidIcon },
    ];

    return (
        <div className="bg-white p-6 rounded-lg w-80 shadow-md">
            {/* Mode Selection */}
            <div className="flex justify-between mb-4">
                {modes.map((mode) => (
                    <button
                        key={mode.name}
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-full ${
                            selectedMode === mode.name
                                ? "bg-orange-100 text-orange-500 border-2 border-orange-500"
                                : "bg-gray-200 text-gray-500"
                        }`}
                        onClick={() => setSelectedMode(mode.name)}
                    >
                        {/* Icon */}
                        <img
                            src={mode.icon}
                            alt={mode.name}
                            className="w-6 h-6 mb-1"
                        />
                        {/* Mode Name */}
                        <span className="text-sm">{mode.name}</span>
                    </button>
                ))}
            </div>

            {/* Settings Rows */}
            <div className="flex flex-col gap-4">
                {/* Air Flux Direction */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">
                        Air flux direction
                    </span>
                    <div className="flex items-center">
                        <button
                            className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                            onClick={() => setAirFluxDirection("Low")}
                        >
                            &lt;
                        </button>
                        <span className="mx-2 text-gray-700">{airFluxDirection}</span>
                        <button
                            className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                            onClick={() => setAirFluxDirection("High")}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

                {/* Air Flux Rate */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Air flux rate</span>
                    <div className="flex items-center">
                        <button
                            className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                            onClick={() => setAirFluxRate("Low")}
                        >
                            &lt;
                        </button>
                        <span className="mx-2 text-gray-700">{airFluxRate}</span>
                        <button
                            className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"
                            onClick={() => setAirFluxRate("High")}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
