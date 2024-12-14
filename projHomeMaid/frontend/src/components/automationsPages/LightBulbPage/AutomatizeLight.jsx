import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/automations";

export default function AutomatizeLight({ deviceId }) {
    const [automatizations, setAutomatizations] = useState([]);
    const [onTime, setOnTime] = useState("08:00");
    const [brightness, setBrightness] = useState(50); // Default brightness
    const [color, setColor] = useState("#ffffff"); // Default color
    const [action, setAction] = useState("Turn On");

    useEffect(() => {
        // Fetch existing automatizations
        const fetchAutomatizations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}`);
                const data = await response.json();
                const deviceAutomatizations = data.filter(
                    (item) => item.deviceId === deviceId
                );
                setAutomatizations(deviceAutomatizations);
            } catch (err) {
                console.error("Error fetching automatizations:", err);
            }
        };

        fetchAutomatizations();

        // WebSocket connection
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket for Lights Automatizations!");

            client.subscribe(`/topic/device-updates`, (message) => {
                try {
                    const updatedData = JSON.parse(message.body);

                    if (
                        updatedData.deviceId === deviceId &&
                        updatedData.executionTime &&
                        updatedData.changes &&
                        updatedData.changes.state !== undefined &&
                        (updatedData.changes.brightness !== undefined || updatedData.changes.color)
                    ) {
                        setAutomatizations((prev) => [...prev, updatedData]);
                        console.log("Updated automatization received via WebSocket:", updatedData);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const addAutomatization = async () => {
        const newAutomatization = {
            deviceId,
            executionTime: onTime,
            changes:
                action === "Turn On"
                    ? {
                        state: true,
                        brightness: parseInt(brightness, 10),
                        color,
                    }
                    : { state: false },
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAutomatization),
            });

            if (!response.ok) {
                throw new Error(`Failed to add automatization: ${response.statusText}`);
            }

            const data = await response.json();
            setAutomatizations([...automatizations, data]);
            console.log("Automatization added successfully.");
        } catch (err) {
            console.error("Error adding automatization:", err);
        }
    };

    const deleteAutomatization = async (index) => {
        const automatization = automatizations[index];
        try {
            const response = await fetch(`${API_BASE_URL}/${automatization.deviceId}/${automatization.executionTime}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete automatization: ${response.statusText}`);
            }

            setAutomatizations(automatizations.filter((_, i) => i !== index));
            console.log("Automatization deleted successfully.");
        } catch (err) {
            console.error("Error deleting automatization:", err);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize Light</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Time</label>
                        <input
                            type="time"
                            value={onTime}
                            onChange={handleOnTimeChange}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Action</label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                            <option value="Turn On">Turn On</option>
                            <option value="Turn Off">Turn Off</option>
                        </select>
                    </div>

                    {action === "Turn On" && (
                        <>
                            <div className="flex items-center justify-between">
                                <label className="text-gray-600 font-medium">Brightness</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="1"
                                    value={brightness}
                                    onChange={(e) => setBrightness(e.target.value)}
                                    className="w-32 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="text-gray-700 font-medium">{brightness}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-gray-600 font-medium">Color</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

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
                            {item.changes.state ? (
                                <>
                                    <span className="block font-medium">
                                        Brightness:{" "}
                                        <span className="font-semibold">{item.changes.brightness}</span>
                                    </span>
                                    <span className="block font-medium">
                                        Color:{" "}
                                        <span className="font-semibold">{item.changes.color}</span>
                                    </span>
                                </>
                            ) : (
                                <span className="block font-medium">Action: Turn Off</span>
                            )}
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

            <button
                onClick={addAutomatization}
                className="mt-6 w-14 h-14 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
                +
            </button>
        </div>
    );
}
