import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import StateControl from "../../components/automationsPages/stereoPage/StateControl.jsx";
import StereoAutomation from "../../components/automationsPages/stereoPage/StereoAutomation.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import { useNavigate } from "react-router-dom";

export default function StereoControl() {
    const DEFAULT_VOLUME = 50;
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [deviceName, setDeviceName] = useState("Speaker");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    // Fetch speaker data from API
    useEffect(() => {
        const fetchSpeakerData = async () => {
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

                setIsSpeakerOn(data.state || false);
                setVolume(data.volume != null ? Number(data.volume) : DEFAULT_VOLUME);
                setDeviceName(data.name || "Speaker"); // Define o nome do dispositivo

                if(response.status === 403){
                    navigate("/login");
                }

            } catch (err) {
                console.error("Error fetching speaker data:", err);
                setError("Failed to fetch speaker data.");
            }
        };

        fetchSpeakerData();

        // WebSocket setup
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
                    if (updatedData.state !== undefined) setIsSpeakerOn(updatedData.state);
                    if (updatedData.volume !== undefined) setVolume(Number(updatedData.volume));
                    if (updatedData.name !== undefined) setDeviceName(updatedData.name);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("WebSocket STOMP error:", frame.headers["message"]);
            console.error("Error details:", frame.body);
        };

        client.activate();

        return () => client.deactivate(); // Cleanup WebSocket on component unmount
    }, [deviceId]);

    const toggleSpeaker = async () => {
        try {
            const updatedState = !isSpeakerOn;

            await saveStateToDatabase(updatedState, volume);
            setIsSpeakerOn(updatedState);
        } catch (err) {
            console.error("Error toggling speaker:", err);
            setError("Failed to toggle speaker.");
        }
    };

    const updateVolume = async (newVolume) => {
        try {
            const volumeNumber = Number(newVolume);
            setVolume(volumeNumber);

            if (isSpeakerOn) {
                await saveStateToDatabase(true, volumeNumber);
            }
        } catch (err) {
            console.error("Error updating volume:", err);
            setError("Failed to update volume.");
        }
    };

    const saveStateToDatabase = async (state, volume) => {
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
                body: JSON.stringify({ state, volume }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }
        } catch (err) {
            console.error("Error saving state and volume to database:", err);
            setError("Failed to save state and volume to database.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Top Bar com o AutomationsHeader */}
            <AutomationsHeader />

            {/* Título do Dispositivo */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">{deviceName}</span>
            </div>

            {/* State Control */}
            <StateControl
                isSpeakerOn={isSpeakerOn}
                toggleSpeaker={toggleSpeaker}
                volume={volume}
                updateVolume={updateVolume}
            />

            <AutomationBox deviceId={deviceId}>
                <StereoAutomation deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
