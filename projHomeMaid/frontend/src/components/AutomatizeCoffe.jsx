import React, { useState } from "react";

export default function Automatize() {
    const [automatizations, setAutomatizations] = useState([
        { time: "10:00 AM", type: "Espresso" }, // Initial automatization
    ]);
    const [isAutomatizeOn, setIsAutomatizeOn] = useState(true); // Toggle state
    const [onTime, setOnTime] = useState("10:00"); // On Time (time input)
    const [selectedType, setSelectedType] = useState("Espresso"); // Editable type

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const addAutomatization = () => {
        const newAutomatization = {
            time: onTime,
            type: selectedType,
        };
        setAutomatizations([...automatizations, newAutomatization]);
    };

    const toggleAutomatization = () => {
        setIsAutomatizeOn((prev) => !prev); // Toggle the automatization
    };

    const deleteAutomatization = (index) => {
        setAutomatizations(automatizations.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Automatize Container */}
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize</h2>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isAutomatizeOn}
                            onChange={toggleAutomatization}
                        />
                        <div
                            className={`w-12 h-6 rounded-full ${
                                isAutomatizeOn ? "bg-orange-500" : "bg-gray-300"
                            }`}
                        >
                            <div
                                className={`w-6 h-6 bg-white rounded-full shadow transform ${
                                    isAutomatizeOn ? "translate-x-6" : "translate-x-0"
                                } transition-all duration-300`}
                            ></div>
                        </div>
                    </label>
                </div>

                {isAutomatizeOn && (
                    <div className="space-y-4">
                        {/* On Time Input */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">On</label>
                            <input
                                type="time"
                                value={onTime}
                                onChange={handleOnTimeChange}
                                className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="Espresso">Espresso</option>
                                <option value="Tea">Tea</option>
                                <option value="Latte">Latte</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* List of Automatizations */}
            {isAutomatizeOn && (
                <div className="w-full space-y-3">
                    {automatizations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
                        >
                            <div className="text-sm">
                                <span className="block font-medium">
                                    Time: <span className="font-semibold">{item.time}</span>
                                </span>
                                <span className="block font-medium">
                                    Type: <span className="font-semibold">{item.type}</span>
                                </span>
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
            {isAutomatizeOn && (
                <button
                    onClick={addAutomatization}
                    className="mt-6 w-14 h-14 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    +
                </button>
            )}
        </div>
    );
}
