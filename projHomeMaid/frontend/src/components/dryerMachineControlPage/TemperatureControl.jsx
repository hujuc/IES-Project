import React from "react";
import lowTempIcon from "../../assets/low_temperature.png"; // Icon for low temperature
import highTempIcon from "../../assets/high_temperature.png"; // Icon for high temperature

export default function TemperatureControl({ isWasherOn, temperature, updateTemperature }) {
    return (
        <div
            className={`mt-6 w-60 text-center ${
                isWasherOn ? "opacity-50 pointer-events-none" : ""
            }`}
        >
            <div className="flex justify-between items-center">
                {/* Low temperature icon */}
                <img src={lowTempIcon} alt="Low Temperature" className="w-8 h-8" />

                {/* Slider */}
                <input
                    type="range"
                    min="50"
                    max="90"
                    step="1"
                    value={temperature}
                    onChange={(e) => updateTemperature(parseFloat(e.target.value))}
                    disabled={isWasherOn} // Disable when washer is on
                    className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #FFA726 ${
                            ((temperature - 50) / 40) * 100
                        }%, #e5e7eb ${
                            ((temperature - 50) / 40) * 100
                        }%)`, // Orange visual effect for slider
                    }}
                />
                {/* High temperature icon */}
                <img src={highTempIcon} alt="High Temperature" className="w-8 h-8" />
            </div>
            <p className="text-orange-500 font-semibold mt-0">{temperature.toFixed(0)}°C</p> {/* Display temperature in orange */}
        </div>
    );
}
