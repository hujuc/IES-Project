import React from "react";
import alarmIcon from "../../../assets/automationsPages/devices/clock/alarm-clock.png"; // Replace with your actual path

export default function StateControl({ deviceId, lightOn, setLightOn, updateDeviceState }) {
    const toggleAlarm = () => {
        if (lightOn) {
            setLightOn(false); // Turn off the alarm manually
            updateDeviceState(false, false); // Update the backend
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
                        onClick={toggleAlarm}
                        className="w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none"
                        disabled={!lightOn} // Disable the button if the alarm is not ringing
                        title={!lightOn ? "Alarm can only be activated by automation" : "Turn off manually"}
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
