import React, { useState, useEffect } from "react";
import alarmIcon from "../../assets/alarm-clock.png"; // Replace with your actual path

export default function ClockCentralControl({ deviceId }) {
    const [lightOn, setLightOn] = useState(false); // Default to false initially
    const [timerActive, setTimerActive] = useState(false); // Track if the timer is active

    // Fetch the initial state from the backend
    useEffect(() => {
        const fetchDeviceState = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                // Initialize `lightOn` with the state from the backend
                setLightOn(data.state || false);
            } catch (error) {
                console.error("Error fetching device state:", error);
            }
        };

        fetchDeviceState();
    }, [deviceId]);

    // Function to turn off the light manually
    const toggleLight = () => {
        if (lightOn) {
            setLightOn(false); // Turn the light off manually
            setTimerActive(false); // Clear the timer if turned off manually

            // Update the backend state
            updateDeviceState(false);
        }
    };

    // Automatically turn off the red light after 30 seconds
    // useEffect(() => {
    //     let timer;
    //     if (lightOn && timerActive) {
    //         timer = setTimeout(() => {
    //             setLightOn(false); // Turn the light off after 30 seconds
    //             setTimerActive(false); // Deactivate the timer
    //
    //             // Update the backend state
    //             updateDeviceState(false);
    //         }, 30000);
    //     }
    //
    //     return () => clearTimeout(timer); // Cleanup the timer on unmount or state change
    // }, [lightOn, timerActive]);

    // Function to update the state in the backend
    const updateDeviceState = async (state) => {
        try {
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state }),
            });
            console.log("Device state updated successfully.");
        } catch (error) {
            console.error("Error updating device state:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Outer container with white background */}
            <div className="w-40 h-52 bg-white rounded-3xl flex items-center justify-center shadow-md relative">
                {/* Inner circular orange ring */}
                <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center">
                    {/* Alarm Button */}
                    <button
                        onClick={toggleLight}
                        className="w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none"
                        disabled={!lightOn} // Disable the button if the light is off
                        title={!lightOn ? "Can only be turned on by automation" : "Turn off manually"}
                    >
                        <img
                            src={alarmIcon}
                            alt="Alarm"
                            className="h-10 w-10"
                        />
                    </button>
                </div>

                {/* Red indicator light */}
                <div
                    className={`absolute top-2 w-4 h-4 rounded-full border-2 border-white ${
                        lightOn ? "bg-red-600" : "bg-gray-300"
                    }`}
                ></div>
            </div>
        </div>
    );
}
