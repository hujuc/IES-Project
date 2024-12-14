import React, { useState, useEffect } from "react";

export default function TemperatureControl({ deviceId, initialTemperature }) {
    const [temperature, setTemperature] = useState(initialTemperature);

    // Sincronizar o estado local com o valor inicial sempre que ele mudar
    useEffect(() => {
        setTemperature(initialTemperature);
    }, [initialTemperature]);

    const updateTemperature = (newTemperature) => {
        fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ temperature: newTemperature }),
        })
            .then((response) => response.json())
            .then((data) => {
                setTemperature(data.temperature);
            })
            .catch((error) =>
                console.error("Error updating temperature:", error)
            );
    };

    const increaseTemperature = () => {
        if (temperature < 32) {
            const newTemperature = temperature + 1;
            updateTemperature(newTemperature);
        }
    };

    const decreaseTemperature = () => {
        if (temperature > 12) {
            const newTemperature = temperature - 1;
            updateTemperature(newTemperature);
        }
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg w-80 h-64 relative">
            {/* Half-Arch Radial Meter */}
            <div className="relative w-64 h-32">
                <svg
                    viewBox="0 0 100 50"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background Segments */}
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

                    {/* Active Segments */}
                    {[...Array(Math.floor((temperature - 12) * 20 / 20))].map(
                        (_, i) => (
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
                        )
                    )}
                </svg>

                {/* Temperature Value */}
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

                {/* Temperature Markers */}
                <div className="absolute inset-0 flex justify-between items-center mt-40">
                    <span className="text-gray-500 text-xs">12°C</span>
                    <span className="text-gray-500 text-xs">32°C</span>
                </div>
            </div>
            {/* Controls */}
            <div className="flex justify-between items-center mt-8 space-x-8">
                <button
                    className="text-white bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-600 text-3xl"
                    onClick={decreaseTemperature}
                >
                    -
                </button>
                <button
                    className="text-white bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-400 text-3xl"
                    onClick={increaseTemperature}
                >
                    +
                </button>
            </div>
        </div>
    );
}
