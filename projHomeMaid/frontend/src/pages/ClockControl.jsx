import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import ClockCentralControl from "../components/ClockCentralControl.jsx";
import Automatize from "../components/AutomatizeAlarmClock.jsx";

export default function ClockControl() {
    const deviceId = "Clock001";
    const [alarmSound, setAlarmSound] = useState("sound1"); // Default alarm sound
    const [automatizeSounds, setAutomatizeSounds] = useState([
        { value: "sound1", label: "Alarm Sound 1" },
        { value: "sound2", label: "Alarm Sound 2" },
        { value: "sound3", label: "Alarm Sound 3" },
    ]);
    const [error, setError] = useState(null);

    // Fetch the initial alarm sound from the API
    useEffect(() => {
        const fetchAlarmSound = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();
                setAlarmSound(data.alarmSound || "sound1"); // Default to "sound1" if no sound is set
            } catch (err) {
                console.error("Error fetching alarm sound:", err);
                setError("Failed to fetch the alarm sound.");
            }
        };

        if (deviceId) {
            fetchAlarmSound();
        }
    }, [deviceId]);

    // Update the alarm sound in the database
    const updateAlarmSound = async (sound) => {
        try {
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ alarmSound: sound }), // Send only the alarmSound field
            });
            setAlarmSound(sound); // Update the local state
            console.log("Alarm sound updated successfully.");
        } catch (err) {
            console.error("Error updating alarm sound:", err);
            setError("Failed to update the alarm sound.");
        }
    };

    const handleAlarmSoundChange = (e) => {
        const newSound = e.target.value;
        setAlarmSound(newSound); // Update the local state
        updateAlarmSound(newSound); // Update the database
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                <div className="h-16 w-16">
                    <GetBackButton/>
                </div>
                <div className="h-12 w-14">
                    <EllipsisButton/>
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

            {/* Central Control */}
            <div className="mt-8 w-full px-4">
                <ClockCentralControl alarmSound={alarmSound}/>
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                >
                    <Automatize alarmSounds={automatizeSounds} selectedSound={alarmSound}/>
                </div>
            </div>
        </div>
    );
}
