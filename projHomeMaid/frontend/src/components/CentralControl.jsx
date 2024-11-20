import React, { useState, useEffect } from "react";
import coffeeIcon from "../assets/coffee-icon.png"; // Replace with your actual path

export default function CentralControl() {
    const [lightOn, setLightOn] = useState(false);

    // Function to turn on the light if it's currently off
    const toggleLight = () => {
        if (!lightOn) {
            setLightOn(true); // Turn the light on only if it's currently off
        }
    };

    // Automatically turn off the red light after 30 seconds
    useEffect(() => {
        let timer;
        if (lightOn) {
            timer = setTimeout(() => {
                setLightOn(false); // Turn the light off after 30 seconds
            }, 30000);
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or state change
    }, [lightOn]);

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Outer container with white background */}
            <div className="w-40 h-52 bg-white rounded-3xl flex items-center justify-center shadow-md relative">
                {/* Inner circular orange ring */}
                <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center">
                    {/* Coffee Button */}
                    <button
                        onClick={toggleLight}
                        className="w-24 h-24 bg-white rounded-full flex items-center justify-center focus:outline-none"
                    >
                        <img
                            src={coffeeIcon}
                            alt="Coffee"
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
