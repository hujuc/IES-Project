import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/speakersControlPage/StateControl.jsx";
import VolumeControl from "../components/speakersControlPage/VolumeControl.jsx";
import AutomatizeSpeaker from "../components/speakersControlPage/AutomatizeSpeaker.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function SpeakerControl() {
    const DEFAULT_VOLUME = 50;
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    // Fetch speaker data from API
    useEffect(() => {
        const fetchSpeakerData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                setIsSpeakerOn(data.state || false);
                setVolume(data.volume != null ? Number(data.volume) : DEFAULT_VOLUME);
            } catch (err) {
                console.error("Error fetching speaker data:", err);
                setError("Failed to fetch speaker data.");
            }
        };

        fetchSpeakerData();

        // WebSocket setup
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws/devices"),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            // Subscribe to device updates
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.state !== undefined) setIsSpeakerOn(updatedData.state);
                    if (updatedData.volume !== undefined) setVolume(Number(updatedData.volume));
                    console.log("Speaker updated via WebSocket:", updatedData);
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
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, volume }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }

            console.log("State and volume saved successfully:", { state, volume });
        } catch (err) {
            console.error("Error saving state and volume to database:", err);
            setError("Failed to save state and volume to database.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Speaker</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* State Control */}
            <StateControl isSpeakerOn={isSpeakerOn} toggleSpeaker={toggleSpeaker} />

            {/* Volume Control */}
            <VolumeControl isSpeakerOn={isSpeakerOn} volume={volume} updateVolume={updateVolume} />

            {/* Automatization Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeSpeaker deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
