import React, { useState, useEffect } from "react";

export default function TemperatureControl({ deviceId, initialTemperature }) {
    const [temperature, setTemperature] = useState(initialTemperature);

    // Sincronizar o estado local com o valor inicial sempre que `initialTemperature` mudar
    useEffect(() => {
        setTemperature(initialTemperature);
    }, [initialTemperature]);

    const updateTemperature = (newTemperature) => {
        fetch(`http://localhost:8080/api/devices/${deviceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ temperature: newTemperature }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Updated temperature:", data.temperature);
            })
            .catch((error) =>
                console.error("Erro ao atualizar temperatura:", error)
            );
    };

    const increaseTemperature = () => {
        if (temperature < 32) {
            const newTemperature = temperature + 1;
            setTemperature(newTemperature);
            updateTemperature(newTemperature);
        }
    };

    const decreaseTemperature = () => {
        if (temperature > 12) {
            const newTemperature = temperature - 1;
            setTemperature(newTemperature);
            updateTemperature(newTemperature);
        }
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg w-80 h-60 relative">
            {/* Half-Arch Radial Meter */}
            <div className="relative w-64 h-32">
                <svg
                    viewBox="0 0 100 50"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background Segments (Gray) */}
                    {[...Array(20)].map((_, i) => (
                        <line
                            key={i}
                            x1="50"
                            y1="5"
                            x2="50"
                            y2="15"
                            stroke="#d1d5db" // Gray for inactive segments
                            strokeWidth="2"
                            transform={`rotate(${i * 9 - 90} 50 50)`} // Adjust for half-circle
                        />
                    ))}

                    {/* Active Segments (Orange) */}
                    {[...Array(Math.floor((temperature - 12) * 20 / 20))].map(
                        (_, i) => (
                            <line
                                key={i}
                                x1="50"
                                y1="5"
                                x2="50"
                                y2="15"
                                stroke="#f97316" // Orange for active segments
                                strokeWidth="2"
                                transform={`rotate(${i * 9 - 90} 50 50)`} // Adjust for half-circle
                            />
                        )
                    )}
                </svg>

                {/* Temperature Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-12">
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
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-6 space-x-8">
                {/* Decrease Button */}
                <button
                    className="text-white bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-600 text-3xl"
                    onClick={decreaseTemperature}
                >
                    -
                </button>
                {/* Increase Button */}
                <button
                    className="text-white bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-400 text-3xl"
                    onClick={increaseTemperature}
                >
                    +
                </button>
            </div>

            {/* Temperature Labels */}
            <div className="relative w-64 mt-4">
                <div className="absolute left-0 top-[-80px] text-gray-500 text-sm">
                    12°C
                </div>
                <div className="absolute right-0 top-[-80px] text-gray-500 text-sm">
                    32°C
                </div>
            </div>
        </div>
    );
}
