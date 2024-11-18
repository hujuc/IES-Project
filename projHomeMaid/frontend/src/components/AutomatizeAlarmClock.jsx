import React, { useState } from "react";

export default function Automatize({ alarmSounds, selectedSound }) {
    const [automatizations, setAutomatizations] = useState([
        { time: "10:00 AM", sound: "Chime", ringType: "Bell" }, // Initial automatization
    ]);
    const [isAutomatizeOn, setIsAutomatizeOn] = useState(true); // Toggle state
    const [onTime, setOnTime] = useState("10:00"); // On Time (time input)
    const [selectedRingType, setSelectedRingType] = useState("Bell"); // Ring type

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const addAutomatization = () => {
        const newAutomatization = {
            time: onTime,
            sound: selectedSound,
            ringType: selectedRingType,
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
        <div className="flex flex-col items-center w-full max-w-lg mx-auto p-8 bg-[#383634] rounded-2xl shadow-xl space-y-8">
            {/* Automatize Container */}
            <div className="w-full bg-white text-gray-800 p-8 rounded-2xl shadow-md mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700">Automatize</h2>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isAutomatizeOn}
                            onChange={toggleAutomatization}
                        />
                        <div
                            className={`w-14 h-7 rounded-full transition-all ${
                                isAutomatizeOn ? "bg-orange-500" : "bg-gray-300"
                            }`}
                        >
                            <div
                                className={`w-7 h-7 bg-white rounded-full shadow transform ${
                                    isAutomatizeOn ? "translate-x-7" : "translate-x-0"
                                } transition-all duration-300`}
                            ></div>
                        </div>
                    </label>
                </div>

                {isAutomatizeOn && (
                    <div className="space-y-6">
                        {/* On Time Input */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">On</label>
                            <input
                                type="time"
                                value={onTime}
                                onChange={handleOnTimeChange}
                                className="border border-gray-300 rounded-lg p-3 text-gray-800 font-semibold w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        {/* Sound Dropdown */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Sound</label>
                            <select
                                value={selectedSound}
                                onChange={(e) => setSelectedSound(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 text-gray-800 font-semibold w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                {alarmSounds.map((sound) => (
                                    <option key={sound.value} value={sound.value}>
                                        {sound.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ring Type Dropdown */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Ring Type</label>
                            <select
                                value={selectedRingType}
                                onChange={(e) => setSelectedRingType(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 text-gray-800 font-semibold w-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="Bell">Bell</option>
                                <option value="Chime">Chime</option>
                                <option value="Alarm">Alarm</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* List of Automatizations */}
            {isAutomatizeOn && (
                <div className="w-full space-y-4">
                    {automatizations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
                        >
                            <div className="text-sm space-y-2">
                                <span className="block font-medium">
                                    Time: <span className="font-semibold">{item.time}</span>
                                </span>
                                <span className="block font-medium">
                                    Sound: <span className="font-semibold">{item.sound}</span>
                                </span>
                                <span className="block font-medium">
                                    Ring Type: <span className="font-semibold">{item.ringType}</span>
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
                    className="mt-6 w-16 h-16 bg-orange-500 text-white text-3xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    +
                </button>
            )}
        </div>
    );
}
