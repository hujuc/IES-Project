import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function DrinkOptions({ deviceId }) {
    const [selectedOption, setSelectedOption] = useState("Espresso");
    const options = [
        { name: "Espresso", icon: "☕" },
        { name: "Tea", icon: "🍵" },
        { name: "Latte", icon: "🥛" },
    ];
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrinkType = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const { drinkType } = response.data;
                setSelectedOption(capitalize(drinkType) || "Espresso");
            } catch (err) {
                console.error("Error fetching drink type:", err);
                setError("Failed to fetch the current drink type.");
            }
        };

        if (deviceId) fetchDrinkType();
    }, [deviceId]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                if (updatedData.deviceId === deviceId && updatedData.drinkType) {
                    setSelectedOption(capitalize(updatedData.drinkType));
                    console.log("Drink type updated via WebSocket:", updatedData.drinkType);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    const updateDrinkType = async (optionName) => {
        try {
            await axios.patch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                drinkType: optionName.toLowerCase(),
            });
            console.log("Drink type updated successfully");
        } catch (err) {
            console.error("Error updating drink type:", err);
            setError("Failed to update the selected drink type.");
        }
    };

    const handleSelection = (optionName) => {
        setSelectedOption(optionName);
        updateDrinkType(optionName);
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="flex flex-col items-center">
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex space-x-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelection(option.name)}
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg shadow-md focus:outline-none ${
                            selectedOption === option.name
                                ? "bg-orange-500 text-white"
                                : "bg-white text-gray-800"
                        }`}
                    >
                        <span className="text-3xl">{option.icon}</span>
                        <span className="text-sm font-medium">{option.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
