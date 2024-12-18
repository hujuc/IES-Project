import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/heatedFloorsControlPage/StateControl.jsx";
import HeatedFloorAutomation from "../../components/automationsPages/heatedFloorsControlPage/heatedFloorAutomation.jsx";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx"; 
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

export default function HeatedFloorsControl() {
    const [isHeatedOn, setIsHeatedOn] = useState(false);
    const [temperature, setTemperature] = useState(20.0);
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();
    const navigate = useNavigate();

    const fetchHeatedFloorsData = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method : "GET",
                headers : {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();

            if (data.state !== undefined) {
                setIsHeatedOn(data.state);
            }

            if (data.temperature !== undefined) {
                setTemperature(data.temperature);
            }

            if (data.name !== undefined) {
                setName(data.name);
            }

            if (response.status === 403){
                navigate("/login");
            }
        } catch (err) {
            console.error("Error fetching heated floors data:", err);
            setError("Failed to fetch heated floors data.");
        }
    };

    useEffect(() => {
        fetchHeatedFloorsData();

        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsHeatedOn(updatedData.state);
                    if (updatedData.temperature !== undefined) setTemperature(updatedData.temperature);
                    if (updatedData.name !== undefined) setName(updatedData.name); // Update name if available
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Disconnect on component unmount
    }, [deviceId]);

    // Function to toggle the heated floor state
    const toggleHeatedFloors = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isHeatedOn;

            await saveStateToDatabase(updatedState, updatedState ? temperature : null);

            setIsHeatedOn(updatedState);
        } catch (err) {
            console.error("Error toggling heated floors:", err);
            setError("Failed to toggle heated floors.");
        }
    };

    // Function to update the temperature
    const updateTemperature = async (newTemperature) => {
        try {
            const tempNumber = Number(newTemperature);
            setTemperature(tempNumber);

            if (isHeatedOn) {
                await saveStateToDatabase(true, tempNumber);
            }
        } catch (err) {
            console.error("Error updating temperature:", err);
            setError("Failed to update temperature.");
        }
    };

    // Function to save state and temperature to the backend
    const saveStateToDatabase = async (state, temperature) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state, temperature }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }
        } catch (err) {
            console.error("Error saving state and temperature to database:", err);
            setError("Failed to save state and temperature to database.");
        }
    };

    // Return the UI
    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{name || "Loading..."}</span>
            </div>

            {/* State Control */}
            <div className="mt-8">
                <StateControl
                    isHeatedOn={isHeatedOn}
                    toggleHeatedFloors={toggleHeatedFloors}
                    temperature={temperature}
                    updateTemperature={updateTemperature}
                />
            </div>

            {/* Automation Box */}
            <AutomationBox deviceId={deviceId}>
                <HeatedFloorAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
