import React, { useState, useEffect } from "react";
import GetBackButton from "../components/AirConditionerPage/GetBackButton.jsx";
import EllipsisButton from "../components/AirConditionerPage/EllipsisButton.jsx";
import TemperatureControl from "../components/AirConditionerPage/TemperatureControl.jsx";
import AirFluxControl from "../components/AirConditionerPage/AirFluxControl.jsx";
import Automatize from "../components/AirConditionerPage/AutomatizeAirCond.jsx";

export default function AirConditionerControl() {
    const [deviceData, setDeviceData] = useState(null);

    const url = window.location.href;
    console.log("URL completa:", url);
    const urlParts = url.split("/");
    console.log("Partes do URL:", urlParts);
    const deviceId = urlParts[urlParts.length - 1];
    console.log("Device ID:", deviceId);

    // Fetch device data from API
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();
                setDeviceData(data);
            } catch (error) {
                console.error("Error fetching device data:", error);
            }
        };

        fetchDeviceData();
    }, [deviceId]);

    if (!deviceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center w-screen min-h-screen"
            style={{ backgroundColor: "#433F3C" }}
        >
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
                <div className="form-control w-60">
                    <label className="label cursor-pointer">
                        <span className="label-text text-2xl font-semibold text-white">
                            Air Conditioner
                        </span>
                        <input
                            type="checkbox"
                            className="toggle bg-gray-300 checked:bg-orange-500"
                            checked={deviceData.state || false}
                            readOnly
                        />
                    </label>
                </div>
            </div>

            {/* Temperature Control */}
            <div className="mt-8">
                <TemperatureControl
                    deviceId={deviceId}
                    initialTemperature={deviceData.temperature}
                />
            </div>

            {/* Air Flux Control */}
            <div className="mt-8">
                <AirFluxControl deviceId={deviceId} deviceData={deviceData} />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6">
                <Automatize />
            </div>
        </div>
    );
}
