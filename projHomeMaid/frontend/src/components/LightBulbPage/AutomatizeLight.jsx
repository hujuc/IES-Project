import React, { useState } from "react";

export default function Automatize({ deviceId }) {
    const [automatizations, setAutomatizations] = useState([]);
    const [isAutomatizeOn, setIsAutomatizeOn] = useState(false);
    const [onTime, setOnTime] = useState("18:00"); // Exemplo: ligar às 18:00
    const [offTime, setOffTime] = useState("06:00"); // Exemplo: desligar às 06:00

    const toggleAutomatization = () => {
        setIsAutomatizeOn((prev) => !prev);
    };

    const addAutomatization = () => {
        const newAutomatization = {
            onTime,
            offTime,
        };
        setAutomatizations([...automatizations, newAutomatization]);
    };

    const deleteAutomatization = (index) => {
        setAutomatizations(automatizations.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-between mb-4 w-full">
                <h2 className="text-xl font-semibold">Automatize</h2>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={isAutomatizeOn}
                        onChange={toggleAutomatization}
                    />
                    <div
                        className={`w-12 h-6 rounded-full ${
                            isAutomatizeOn ? "bg-green-500" : "bg-gray-300"
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
                <>
                    <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Turn On</label>
                            <input
                                type="time"
                                value={onTime}
                                onChange={(e) => setOnTime(e.target.value)}
                                className="bg-white border border-gray-300 p-2 rounded-lg"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Turn Off</label>
                            <input
                                type="time"
                                value={offTime}
                                onChange={(e) => setOffTime(e.target.value)}
                                className="bg-white border border-gray-300 p-2 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={addAutomatization}
                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-400"
                        >
                            Add Automatization
                        </button>
                    </div>

                    <ul className="mt-6 space-y-2 w-full">
                        {automatizations.map((item, index) => (
                            <li
                                key={index}
                                className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-gray-700 font-semibold">
                                        On: {item.onTime} - Off: {item.offTime}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteAutomatization(index)}
                                    className="text-red-500 font-semibold hover:underline"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
