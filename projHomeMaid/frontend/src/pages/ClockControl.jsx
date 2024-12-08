import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import ClockCentralControl from "../components/clockPage/ClockCentralControl.jsx";
import Automatize from "../components/clockPage/AutomatizeAlarmClock.jsx";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function ClockControl() {
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    const [alarmSound, setAlarmSound] = useState("sound1"); // Default alarm sound
    const [automatizeSounds, setAutomatizeSounds] = useState([
        { value: "sound1", label: "Alarm Sound 1" },
        { value: "sound2", label: "Alarm Sound 2" },
        { value: "sound3", label: "Alarm Sound 3" },
    ]);
    const [volume, setVolume] = useState(50); // Default volume
    const [error, setError] = useState(null);

    // Fetch the initial clock data and setup WebSocket
    useEffect(() => {
        const fetchClockData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                setAlarmSound(data.alarmSound || "sound1"); // Default to "sound1" if not set
                setVolume(data.volume || 50); // Default to 50 if not set
            } catch (err) {
                console.error("Error fetching clock data:", err);
                setError("Failed to fetch the clock data.");
            }
        };

        fetchClockData();

        // Setup WebSocket with SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws/devices"),
            reconnectDelay: 5000, // Retry connection every 5 seconds
            heartbeatIncoming: 4000, // Check server every 4 seconds
            heartbeatOutgoing: 4000, // Inform server every 4 seconds
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket STOMP!");

            // Subscribe to updates for the specific device
            client.subscribe(`/topic/device-updates`, (message) => {
                const updatedData = JSON.parse(message.body);
                console.log("Message received via WebSocket:", updatedData);

                if (updatedData.deviceId === deviceId) {
                    if (updatedData.alarmSound) setAlarmSound(updatedData.alarmSound);
                    if (updatedData.volume) setVolume(updatedData.volume);
                    console.log("Updated data in frontend:", updatedData);
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

    // Update the alarm sound in the database
    const updateAlarmSound = async (sound) => {
        try {
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ alarmSound: sound }),
            });
            setAlarmSound(sound);
            console.log("Alarm sound updated successfully.");
        } catch (err) {
            console.error("Error updating alarm sound:", err);
            setError("Failed to update the alarm sound.");
        }
    };

    // Update the volume in the database
    const updateVolume = async (newVolume) => {
        try {
            const roundedVolume = Math.round(newVolume / 10) * 10;
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ volume: roundedVolume }),
            });
            setVolume(roundedVolume);
            console.log("Volume updated successfully.");
        } catch (err) {
            console.error("Error updating volume:", err);
            setError("Failed to update the volume.");
        }
    };

    const handleAlarmSoundChange = (e) => {
        const newSound = e.target.value;
        setAlarmSound(newSound);
        updateAlarmSound(newSound);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value, 10);
        setVolume(newVolume);
        updateVolume(newVolume);
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>
            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Clock</span>
            </div>

            {/* Alarm Sound Selector */}
            <div className="flex flex-col items-center justify-center mt-6 space-y-4 w-full px-4">
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex flex-col items-center w-full max-w-md space-y-4 mt-4">
                    <label className="text-lg font-semibold mb-2">Select Alarm Sound:</label>
                    <select
                        value={alarmSound}
                        onChange={handleAlarmSoundChange}
                        className="bg-white text-black p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                    >
                        {automatizeSounds.map((sound) => (
                            <option key={sound.value} value={sound.value}>
                                {sound.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex flex-col items-center justify-center mt-6 w-full px-4">
                <label className="text-lg font-semibold mb-2">Volume</label>
                <div className="flex flex-col items-center justify-between">
                    <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full bg-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                        style={{
                            background: `linear-gradient(to right, #F97316 ${volume}%, #e5e7eb ${volume}%)`,
                        }}
                    />
                    <div className="flex justify-between w-full px-2 mt-2 text-sm text-gray-500">
                        <span>10</span>
                        <span>50</span>
                        <span>100</span>
                    </div>
                    <p className="text-gray-400 font-medium mt-2">Current Volume: {volume}</p>
                </div>
            </div>

            {/* Central Control */}
            <div className="mt-8 w-full px-4">
                <ClockCentralControl alarmSound={alarmSound} deviceId={deviceId} />
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md">
                    <Automatize deviceId={deviceId} alarmSounds={automatizeSounds} selectedSound={alarmSound} />
                </div>
            </div>
        </div>
    );
}
