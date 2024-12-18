import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for redirecting to login
import coffeeMachineOn from "../../../assets/automationsPages/devices/coffeeMachine/coffeeMachineOn.png"; // Imagem para estado ligado
import coffeeMachineOff from "../../../assets/automationsPages/devices/coffeeMachine/coffeeMachineOff.png"; // Imagem para estado desligado

export default function StateControl({ deviceId }) {
    const [device, setDevice] = useState(null);
    const [lightOn, setLightOn] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Espresso");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    const options = [
        { name: "Espresso", icon: "☕" },
        { name: "Tea", icon: "🍵" },
        { name: "Latte", icon: "🥛" },
    ];

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }
        // Fetch device data
        const fetchDevice = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = response.data;

                setDevice(data);
                setLightOn(data.state || false);
                setIsLocked(data.state || false);
                setSelectedOption(capitalize(data.drinkType || "Espresso"));
            } catch (err) {
                console.error("Error fetching device data:", err);
                setError("Failed to fetch device data.");
            }
        };

        if (deviceId) fetchDevice();
    }, [deviceId]);

    useEffect(() => {
        // Subscribe to WebSocket updates
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedDevice = JSON.parse(message.body);

                if (updatedDevice.deviceId === deviceId) {
                    setLightOn(updatedDevice.state || false);
                    setIsLocked(updatedDevice.state || false);
                    if (updatedDevice.drinkType) {
                        setSelectedOption(capitalize(updatedDevice.drinkType));
                    }
                }
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [deviceId]);

    const toggleLight = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }
        if (isLocked) return;

        try {
            const updatedState = true;
            // Update light state to ON
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                { state: updatedState },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization header
                    },
                }
            );

            setLightOn(updatedState);
            setIsLocked(true);

            // Reset after 30 seconds
            setTimeout(async () => {
                try {
                    // Update light state to OFF
                    await axios.patch(
                        `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                        { state: false },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Authorization header
                            },
                        }
                    );

                    setLightOn(false);
                    setIsLocked(false);
                } catch (resetError) {
                    console.error("Failed to reset device state:", resetError);
                }
            }, 30000);
        } catch (err) {
            console.error("Failed to update device state:", err);
            setError("Failed to update device state.");
        }
    };

    const updateDrinkType = async (optionName) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                { drinkType: optionName.toLowerCase() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedOption(optionName);
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

            {/* Toggle Light Section */}
            <div className="w-40 h-52 bg-white rounded-3xl flex items-center justify-center shadow-md relative mb-6">
                <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center">
                    <button
                        onClick={toggleLight}
                        className={`w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none ${
                            isLocked ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={isLocked}
                    >
                        <img
                            src={lightOn ? coffeeMachineOn : coffeeMachineOff}
                            alt={lightOn ? "Coffee Machine On" : "Coffee Machine Off"}
                            className="h-14 w-14"
                        />
                    </button>
                </div>
                {lightOn && (
                    <div className="absolute top-2 w-4 h-4 rounded-full border-2 border-white bg-red-600"></div>
                )}
            </div>

            {/* Drink Options Section */}
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
