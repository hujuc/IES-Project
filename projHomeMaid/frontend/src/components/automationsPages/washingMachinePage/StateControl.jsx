import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dryerOnIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png";
import dryerOffIcon from "../../../assets/automationsPages/devices/washer/washer_aut.png";
import lowTempIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png";
import highTempIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/devices";

const modeMap = {
    "Regular Dry": "regularDry",
    "Gentle Dry": "gentleDry",
    "Permanent Press": "permanentPress",
};

const formatModeToDisplay = (backendMode) =>
    Object.keys(modeMap).find((key) => modeMap[key] === backendMode) || backendMode;

const formatModeToBackend = (displayMode) => modeMap[displayMode] || displayMode;

export default function StateControl({ deviceId }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentState, setCurrentState] = useState({
        isDryerOn: false,
        temperature: 50.0,
        mode: "regularDry",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    useEffect(() => {
        const fetchCurrentState = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token || isTokenExpired(token)) {
                console.log("Token is missing or expired. Redirecting to login.");
                navigate("/login");
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/${deviceId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    if (response.status === 403) navigate("/login");
                    throw new Error(`Failed to fetch device state: ${response.status}`);
                }

                const data = await response.json();
                setCurrentState({
                    isDryerOn: data.state,
                    temperature: data.temperature,
                    mode: data.mode,
                });
                setIsRunning(data.state);
            } catch (error) {
                console.error("Error fetching device state:", error);
                setError("Failed to fetch device state.");
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentState();
    }, [deviceId, navigate]);

    const updateDeviceState = async (newState) => {
        const token = localStorage.getItem("jwtToken");
        if (!token || isTokenExpired(token)) {
            console.log("Token is missing or expired. Redirecting to login.");
            navigate("/login");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/${deviceId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newState),
            });

            if (!response.ok) {
                throw new Error(`Failed to update device state: ${response.statusText}`);
            }

            const updatedState = await response.json();
            setCurrentState({
                isDryerOn: updatedState.state,
                temperature: updatedState.temperature,
                mode: updatedState.mode,
            });
            setIsRunning(updatedState.state);
        } catch (error) {
            console.error("Error updating device state:", error);
            setError("Failed to update device state.");
        }
    };

    const handleToggleDryer = async () => {
        const newState = !currentState.isDryerOn;
        setIsRunning(newState);
        await updateDeviceState({
            state: newState,
            temperature: currentState.temperature,
            mode: currentState.mode,
        });

        if (newState) {
            setTimeout(() => {
                setIsRunning(false);
                updateDeviceState({
                    state: false,
                    temperature: currentState.temperature,
                    mode: currentState.mode,
                });
            }, 120000);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center mt-6">
            {/* Add UI elements here */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
