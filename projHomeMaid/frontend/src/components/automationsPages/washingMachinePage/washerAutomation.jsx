import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/automations";

const washModeMapping = {
    "Regular Wash": "regularWash",
    "Gentle Wash": "gentleWash",
    "Deep Clean": "deepClean",
};

const reverseWashModeMapping = {
    regularWash: "Regular Wash",
    gentleWash: "Gentle Wash",
    deepClean: "Deep Clean",
};

export default function WasherAutomation({ deviceId }) {
    const [automatizations, setAutomatizations] = useState([]);
    const [onTime, setOnTime] = useState("08:00");
    const [temperature, setTemperature] = useState(40);
    const [washMode, setWashMode] = useState("Regular Wash");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAutomatizations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${API_BASE_URL}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in Authorization header
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const deviceAutomatizations = data.filter(
                        (item) => item.deviceId === deviceId
                    );

                    const mappedAutomatizations = deviceAutomatizations.map((item) => ({
                        ...item,
                        changes: {
                            ...item.changes,
                            washMode: reverseWashModeMapping[item.changes.washMode] || item.changes.washMode,
                        },
                    }));
                    setAutomatizations(mappedAutomatizations);
                } else if (response.status === 401) {
                    navigate("/login");
                } else {
                    console.error("Failed to fetch automatizations.");
                }
            } catch (err) {
                console.error("Error fetching automatizations:", err);
            }
        };

        fetchAutomatizations();

        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                try {
                    const updatedData = JSON.parse(message.body);

                    if (updatedData.deviceId === deviceId) {
                        if (updatedData.executionTime) {
                            setAutomatizations((prev) => {
                                const exists = prev.some(
                                    (item) =>
                                        item.executionTime === updatedData.executionTime &&
                                        item.deviceId === updatedData.deviceId
                                );
                                if (exists) {
                                    return prev.map((item) =>
                                        item.executionTime === updatedData.executionTime
                                            ? {
                                                ...updatedData,
                                                changes: {
                                                    ...updatedData.changes,
                                                    washMode: reverseWashModeMapping[updatedData.changes.washMode],
                                                },
                                            }
                                            : item
                                    );
                                } else {
                                    return [
                                        ...prev,
                                        {
                                            ...updatedData,
                                            changes: {
                                                ...updatedData.changes,
                                                washMode: reverseWashModeMapping[updatedData.changes.washMode],
                                            },
                                        },
                                    ];
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId, navigate]);

    const addAutomatization = async () => {
        const newAutomatization = {
            deviceId,
            executionTime: onTime,
            changes: {
                state: true,
                temperature: parseFloat(temperature),
                washMode: washModeMapping[washMode], // Convert to camelCase before sending
            },
        };

        try {
            const token = localStorage.getItem("jwtToken");

            // If token is missing, redirect to login page
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the token in Authorization header
                },
                body: JSON.stringify(newAutomatization),
            });

            if (response.ok) {
                const data = await response.json();
                setAutomatizations((prev) => [
                    ...prev,
                    {
                        ...data,
                        changes: {
                            ...data.changes,
                            washMode: reverseWashModeMapping[data.changes.washMode],
                        },
                    },
                ]);
            } else if (response.status === 401) {
                navigate("/login");
            } else {
                throw new Error(`Failed to add automatization: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Error adding automatization:", err);
        }
    };

    const deleteAutomatization = async (index) => {
        const automatization = automatizations[index];

        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/${automatization.deviceId}/${automatization.executionTime}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in Authorization header
                    },
                }
            );

            if (response.ok) {
                setAutomatizations((prev) => prev.filter((_, i) => i !== index));
            } else if (response.status === 401) {
                navigate("/login");
            } else {
                throw new Error(`Failed to delete automatization: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Error deleting automatization:", err);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize Washer</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Time</label>
                        <input
                            type="time"
                            value={onTime}
                            onChange={(e) => setOnTime(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Temperature</label>
                        <input
                            type="range"
                            min="20"
                            max="90"
                            step="1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-32 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="text-gray-700 font-medium">{temperature.toFixed(0)}°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Wash Mode</label>
                        <select
                            value={washMode}
                            onChange={(e) => setWashMode(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-48 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                            {Object.keys(washModeMapping).map((mode) => (
                                <option key={mode} value={mode}>
                                    {mode}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={addAutomatization}
                className="w-14 h-14 mb-6 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
                +
            </button>

            <div className="w-full space-y-3">
                {automatizations.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
                    >
                        <div className="text-sm">
                            <span className="block font-medium">
                                Time: <span className="font-semibold">{item.executionTime}</span>
                            </span>
                            {item.changes.state && (
                                <>
                                    <span className="block font-medium">
                                        Temperature:{" "}
                                        <span className="font-semibold">{item.changes.temperature}°C</span>
                                    </span>
                                    <span className="block font-medium">
                                        Wash Mode:{" "}
                                        <span className="font-semibold">{item.changes.washMode}</span>
                                    </span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => deleteAutomatization(index)}
                            className="text-red-500 hover:text-red-600 focus:outline-none"
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
        </div>
    );
}
