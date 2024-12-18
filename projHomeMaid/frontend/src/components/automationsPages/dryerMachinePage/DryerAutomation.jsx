import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/automations";

const modeMap = {
    "Regular Dry": "regularDry",
    "Gentle Dry": "gentleDry",
    "Permanent Press": "permanentPress",
};

const reverseModeMap = Object.fromEntries(Object.entries(modeMap).map(([k, v]) => [v, k]));

export default function DryerAutomation({ deviceId }) {
    const [automatizations, setAutomatizations] = useState([]);
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 60,
        dryMode: "Regular Dry",
    });
    const [onTime, setOnTime] = useState("08:00");
    const [temperature, setTemperature] = useState(60);
    const [dryMode, setDryMode] = useState("Regular Dry");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchAutomatizations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch automatizations");

                const data = await response.json();
                const deviceAutomatizations = data
                    .filter((item) => item.deviceId === deviceId)
                    .map((item) => ({
                        ...item,
                        changes: {
                            ...item.changes,
                            dryMode: reverseModeMap[item.changes.dryMode] || item.changes.dryMode,
                        },
                    }));
                setAutomatizations(deviceAutomatizations);
            } catch (err) {
                console.error("Error fetching automatizations:", err);
            }
        };

        const fetchDeviceState = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL.replace("/automations", `/devices/${deviceId}`)}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch device state");

                const data = await response.json();
                setCurrentState({
                    isDryerOn: data.state,
                    temperature: data.temperature || 60,
                    dryMode: reverseModeMap[data.mode] || "Regular Dry",
                });
            } catch (err) {
                console.error("Error fetching device state:", err);
            }
        };

        fetchAutomatizations();
        fetchDeviceState();

        // WebSocket connection
        const client = new Client({
            webSocketFactory: () =>
                new SockJS(
                    `${import.meta.env.VITE_API_URL.replace(
                        "/api",
                        "/ws/devices"
                    )}?token=${token}`
                ),
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
                                                    dryMode:
                                                        reverseModeMap[
                                                            updatedData.changes.dryMode
                                                            ] || updatedData.changes.dryMode,
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
                                                dryMode:
                                                    reverseModeMap[
                                                        updatedData.changes.dryMode
                                                        ] || updatedData.changes.dryMode,
                                            },
                                        },
                                    ];
                                }
                            });
                        }

                        if (updatedData.changes) {
                            setCurrentState((prevState) => ({
                                ...prevState,
                                isDryerOn: updatedData.changes.state ?? prevState.isDryerOn,
                                temperature: updatedData.changes.temperature ?? prevState.temperature,
                                dryMode:
                                    reverseModeMap[updatedData.changes.dryMode] ?? prevState.dryMode,
                            }));
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
        const token = localStorage.getItem("jwtToken");

        const newAutomatization = {
            deviceId,
            executionTime: onTime,
            changes: {
                state: true,
                temperature: parseFloat(temperature),
                dryMode: modeMap[dryMode],
            },
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newAutomatization),
            });

            if (!response.ok) throw new Error("Failed to add automatization");

            const data = await response.json();
            setAutomatizations((prev) => [
                ...prev,
                {
                    ...data,
                    changes: {
                        ...data.changes,
                        dryMode: reverseModeMap[data.changes.dryMode] || data.changes.dryMode,
                    },
                },
            ]);
        } catch (err) {
            console.error("Error adding automatization:", err);
        }
    };

    const deleteAutomatization = async (index) => {
        const token = localStorage.getItem("jwtToken");
        const automatization = automatizations[index];

        try {
            const response = await fetch(
                `${API_BASE_URL}/${automatization.deviceId}/${automatization.executionTime}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error("Failed to delete automatization");

            setAutomatizations((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Error deleting automatization:", err);
        }
    };

return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize Dryer</h2>
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
                            min="50"
                            max="90"
                            step="1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-32 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="text-gray-700 font-medium">{temperature.toFixed(0)}°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Dry Mode</label>
                        <select
                            value={dryMode}
                            onChange={(e) => setDryMode(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-48 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                            {Object.keys(modeMap).map((mode) => (
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
                                        Dry Mode:{" "}
                                        <span className="font-semibold">{item.changes.dryMode}</span>
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
