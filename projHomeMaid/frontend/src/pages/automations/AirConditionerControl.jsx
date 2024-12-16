import React, { useState, useEffect } from "react";
import AutomationsHeader from "../../components/automationsPages/AutomationsHeader.jsx";
import AirConditionerState from "../../components/automationsPages/AirConditionerPage/StateControl.jsx";
import AutomationBox from "../../components/automationsPages/AutomationBox.jsx";
import AutomatizeAirConditioner from "../../components/automationsPages/AirConditionerPage/AirCondAutomation.jsx";
import { useNavigate } from "react-router-dom"; // Import for redirecting to login

export default function AirConditionerControl() {
    const [deviceData, setDeviceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // For navigation
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    // Fetch device data and set WebSocket
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.log("Token not found. Redirecting to login page.");
            navigate("/login");
            return;
        }
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setDeviceData(data);
                setLoading(false);
                if(response.ok){
                    console.log("Fetched Device Data Success");
                }else if(response.status === 403){
                    console.log("Unauthorized Access");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
            }
        };

        fetchDeviceData();
    }, [deviceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!deviceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white">Failed to load device data.</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#433F3C] text-white">
            {/* Header */}
            <AutomationsHeader />

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">
                    {deviceData.name || "Air Conditioner"}
                </span>
            </div>

            {/* State and Control Section */}
            <AirConditionerState deviceId={deviceId} deviceData={deviceData} />

            {/* Automation Section */}
            <AutomationBox deviceId={deviceId}>
                <AutomatizeAirConditioner deviceId={deviceId} />
            </AutomationBox>
        </div>
    );
}
