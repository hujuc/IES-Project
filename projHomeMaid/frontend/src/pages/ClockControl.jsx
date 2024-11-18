import React, { useState } from "react";
import GetBackButton from "../components/GetBackButton.jsx";
import EllipsisButton from "../components/EllipsisButton.jsx";
import ClockCentralControl from "../components/ClockCentralControl.jsx";
import Automatize from "../components/AutomatizeAlarmClock.jsx";

export default function ClockControl() {
    const [alarmSound, setAlarmSound] = useState("sound1"); // Default alarm sound
    const [customSound, setCustomSound] = useState(null); // State to hold custom sound file
    const [automatizeSounds, setAutomatizeSounds] = useState([
        { value: "sound1", label: "Alarm Sound 1" },
        { value: "sound2", label: "Alarm Sound 2" },
        { value: "sound3", label: "Alarm Sound 3" },
    ]);

    // Handler to update the selected alarm sound
    const handleAlarmSoundChange = (e) => {
        setAlarmSound(e.target.value);
    };

    // Handle adding a custom sound
    const handleCustomSoundUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newSound = {
                value: file.name,
                label: file.name,
            };
            setAutomatizeSounds((prevSounds) => [...prevSounds, newSound]);
            setCustomSound(file);
        }
    };

    return (
        <div
            className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white" // Set a unified background color
        >
            {/* Top Bar */}
            <div className="w-full flex justify-between px-6 py-4 items-center">
                {/* Back Button */}
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                {/* Title */}
                <span className="text-3xl font-semibold">Clock</span>
                {/* Three Dots Button */}
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* Toggle Section */}
            <div className="flex flex-col items-center justify-center mt-6 space-y-4 w-full px-4">
                <div className="flex items-center">
                    <span className="text-2xl font-semibold mr-4">Clock</span>
                    <input
                        type="checkbox"
                        className="toggle bg-gray-300 checked:bg-orange-500"
                        checked="checked"
                    />
                </div>
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
                        <option value="custom">Custom Sound (Upload)</option>
                    </select>
                    {alarmSound === "custom" && (
                        <div className="mt-4">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleCustomSoundUpload}
                                className="bg-gray-300 text-black p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Central Control */}
            <div className="mt-8 w-full px-4">
                <ClockCentralControl alarmSound={alarmSound} />
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }} // Subtle shadow for depth
                >
                    <Automatize alarmSounds={automatizeSounds} selectedSound={alarmSound} />
                </div>
            </div>
        </div>
    );
}
