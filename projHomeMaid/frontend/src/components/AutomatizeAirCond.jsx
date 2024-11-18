import React, { useState } from "react";

export default function Automatize() {
    const [isAutomatizeEnabled, setIsAutomatizeEnabled] = useState(false);
    const [onTime, setOnTime] = useState("10:00");
    const [offTime, setOffTime] = useState("14:00");
    const [temperature, setTemperature] = useState(20); // Default temperature
    const [automatizations, setAutomatizations] = useState([]); // List of automations

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const handleOffTimeChange = (e) => {
        setOffTime(e.target.value);
    };

    const handleTemperatureChange = (e) => {
        setTemperature(Number(e.target.value));
    };

    const addAutomatization = () => {
        const newAutomation = {
            onTime,
            offTime,
            temperature,
        };
        setAutomatizations([...automatizations, newAutomation]);
    };

    const deleteAutomatization = (index) => {
        setAutomatizations(automatizations.filter((_, i) => i !== index));
    };

    // Generate an array of numbers from 12 to 32
    const temperatureOptions = Array.from({ length: 32 - 12 + 1 }, (_, i) => 12 + i);

    return (
        <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Automatize</h2>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={isAutomatizeEnabled}
                        onChange={() => setIsAutomatizeEnabled(!isAutomatizeEnabled)}
                    />
                    <div
                        className={`w-12 h-6 rounded-full ${
                            isAutomatizeEnabled ? "bg-orange-500" : "bg-gray-300"
                        }`}
                    >
                        <div
                            className={`w-6 h-6 bg-white rounded-full shadow transform ${
                                isAutomatizeEnabled
                                    ? "translate-x-6"
                                    : "translate-x-0"
                            } transition-all duration-300`}
                        ></div>
                    </div>
                </label>
            </div>

            {/* On/Off Times and Temperature */}
            {isAutomatizeEnabled && (
                <div className="flex flex-col gap-6">
                    {/* On and Off Times in the Same Line */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">On</span>
                            <input
                                type="time"
                                value={onTime}
                                onChange={handleOnTimeChange}
                                className="border border-gray-300 rounded-lg p-2 text-gray-900 font-medium w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Off</span>
                            <input
                                type="time"
                                value={offTime}
                                onChange={handleOffTimeChange}
                                className="border border-gray-300 rounded-lg p-2 text-gray-900 font-medium w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Temperature Selector */}
                    <div className="flex flex-col items-center">
                        <span className="text-gray-700 font-medium mb-2">Temp</span>
                        <select
                            value={temperature}
                            onChange={handleTemperatureChange}
                            className="border border-gray-300 rounded-lg p-2 text-gray-900 font-medium w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                            {temperatureOptions.map((temp) => (
                                <option key={temp} value={temp}>
                                    {temp}°C
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* List of Automatizations */}
            {automatizations.length > 0 && (
                <div className="mt-6 space-y-3">
                    {automatizations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    On: <span className="font-semibold">{item.onTime}</span>
                                </p>
                                <p className="text-sm font-medium">
                                    Off: <span className="font-semibold">{item.offTime}</span>
                                </p>
                                <p className="text-sm font-medium">
                                    Temp: <span className="font-semibold">{item.temperature}°C</span>
                                </p>
                            </div>
                            <button
                                onClick={() => deleteAutomatization(index)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                                aria-label="Delete"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Automatization Button */}
            {isAutomatizeEnabled && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={addAutomatization}
                        className="w-14 h-14 bg-orange-500 text-white text-xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
}
