import React from "react";
import lowHeatIcon from "../../assets/low_temperature.png"; // Ícone para baixa temperatura
import highHeatIcon from "../../assets/high_temperature.png"; // Ícone para alta temperatura

export default function TemperatureControl({ isHeatedOn, temperature, updateTemperature }) {
    return (
        <div
            className={`mt-6 w-60 text-center ${
                isHeatedOn ? "" : "opacity-50 pointer-events-none"
            }`}
        >
            <div className="flex justify-between items-center">
                {/* Ícone para baixa temperatura */}
                <img src={lowHeatIcon} alt="Low Heat" className="w-8 h-8" />

                {/* Slider */}
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.2"
                    value={temperature}
                    onChange={(e) => updateTemperature(parseFloat(e.target.value))}
                    className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #FFA726 ${(temperature / 20) * 100}%, #e5e7eb ${
                            (temperature / 20) * 100
                        }%)`, // Efeito visual no slider
                    }}
                />
                {/* Ícone para alta temperatura */}
                <img src={highHeatIcon} alt="High Heat" className="w-8 h-8" />
            </div>
            <p className="text-white-500 mt-0">{temperature.toFixed(1)}°C</p> {/* Exibe a temperatura atual com 1 casa decimal */}
        </div>
    );
}
