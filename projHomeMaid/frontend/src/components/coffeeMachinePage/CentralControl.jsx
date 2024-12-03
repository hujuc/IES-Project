import React, { useState, useEffect } from "react";

export default function CentralControl({ deviceId }) {
    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);
    const [lightOn, setLightOn] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // Fetch device data
    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();
                setDevice(data);
                setLightOn(data.state || false);
                setIsLocked(data.state || false);
            } catch (err) {
                console.error("Error fetching device data:", err);
                setError("Failed to fetch device data.");
            }
        };

        if (deviceId) fetchDevice();
    }, [deviceId]);

    // Toggle light
    const toggleLight = async () => {
        if (isLocked) return;

        try {
            const updatedState = true;
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: updatedState }),
            });
            setLightOn(updatedState);
            setIsLocked(true);

            // Reset after 30 seconds
            setTimeout(async () => {
                try {
                    await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ state: false }),
                    });
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

    return (
        <div className="flex flex-col items-center justify-center">
            {error && <p className="text-red-500">{error}</p>}
            <div className="w-40 h-52 bg-white rounded-3xl flex items-center justify-center shadow-md relative">
                <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center">
                    <button
                        onClick={toggleLight}
                        className={`w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none ${
                            isLocked ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={isLocked}
                    >
                        <img
                            src={"path/to/alarmIcon.png"}
                            alt="Alarm"
                            className="h-10 w-10"
                        />
                    </button>
                </div>
                {lightOn && (
                    <div
                        className="absolute top-2 w-4 h-4 rounded-full border-2 border-white bg-red-600"
                    ></div>
                )}
            </div>
        </div>
    );
}