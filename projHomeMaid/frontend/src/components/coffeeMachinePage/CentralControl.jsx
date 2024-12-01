import React, { useState, useEffect } from "react";
import coffeeIcon from "../../assets/coffee-icon.png";
import axios from "axios";

export default function CentralControl({ deviceId }) {
    const [device, setDevice] = useState(null); // Fetched device data
    const [error, setError] = useState(null); // Error state
    const [lightOn, setLightOn] = useState(false); // Light state fetched from device
    const [isLocked, setIsLocked] = useState(false); // Prevent toggling while light is on

    // Fetch the device details using the deviceId
    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/devices/${deviceId}`);
                const fetchedDevice = response.data;

                setDevice(fetchedDevice); // Store the full device in state
                setLightOn(fetchedDevice.state); // Set the light state based on the `state` field in the device
                setIsLocked(fetchedDevice.state); // Lock the toggle if the device is on
            } catch (err) {
                setError("Failed to fetch device data.");
                console.error(err);
            }
        };

        if (deviceId) {
            fetchDevice(); // Fetch the device data only if deviceId is provided
        }
    }, [deviceId]);

    // Function to toggle the light state
    const toggleLight = async () => {
        if (isLocked) return; // Prevent toggling if the light is already on

        try {
            const updatedState = true; // Always set to true when toggling
            // Update the state to true
            const response = await axios.patch(`http://localhost:8080/api/devices/${deviceId}`, {
                state: updatedState, // Send only the state field
            });

            setLightOn(updatedState); // Update the light state locally
            setDevice((prevDevice) => ({ ...prevDevice, state: updatedState })); // Update the device state locally
            setIsLocked(true); // Lock the toggle

            // Automatically turn off the light after 30 seconds
            setTimeout(async () => {
                try {
                    // Update the state to false after 30 seconds
                    const resetResponse = await axios.patch(`http://localhost:8080/api/devices/${deviceId}`, {
                        state: false, // Send only the state field
                    });

                    setLightOn(false); // Update the light state locally
                    setDevice((prevDevice) => ({ ...prevDevice, state: false })); // Update the device state locally
                    setIsLocked(false); // Unlock the toggle
                } catch (resetError) {
                    setError("Failed to reset device state.");
                    console.error(resetError);
                }
            }, 30000); // 30 seconds
        } catch (err) {
            setError("Failed to update device state.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Show error if any */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Outer container with white background */}
            <div className="w-40 h-52 bg-white rounded-3xl flex items-center justify-center shadow-md relative">
                {/* Inner circular orange ring */}
                <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center">
                    {/* Coffee Button */}
                    <button
                        onClick={toggleLight}
                        className={`w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none ${
                            isLocked ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={isLocked} // Disable the button while locked
                    >
                        <img
                            src={coffeeIcon}
                            alt="Coffee"
                            className="h-10 w-10"
                        />
                    </button>
                </div>

                {/* Red indicator light */}
                {lightOn && (
                    <div
                        className="absolute top-2 w-4 h-4 rounded-full border-2 border-white bg-red-600"
                    ></div>
                )}
            </div>
        </div>
    );
}
