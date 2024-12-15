import React from "react";
import fullsunIcon from "../../../assets/automationsPages/stateIcons/suns/fullSun.png"; // Ícone para abertura máxima
import outlineSunIcon from "../../../assets/automationsPages/stateIcons/suns/outlineSun.png"; // Ícone para abertura mínima

export default function PercentageControl({ isShutterOpen, openPercentage, updateOpenPercentage }) {
    return (
        <div
            className={`mt-6 w-60 text-center ${
                isShutterOpen ? "" : "opacity-50 pointer-events-none"
            }`}
        >
            <div className="flex justify-between items-center">
                {/* Ícone para abertura mínima */}
                <img src={outlineSunIcon} alt="Closed Shutter" className="w-11 h-11" />

                {/* Slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={openPercentage}
                    onChange={(e) => updateOpenPercentage(e.target.value)}
                    className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #FACC15 ${openPercentage}%, #e5e7eb ${openPercentage}%)`, // Efeito visual no slider
                    }}
                />
                {/* Ícone para abertura máxima */}
                <img src={fullsunIcon} alt="Open Shutter" className="w-11 h-11" />
            </div>
            <p className="text-white-500 mt-0">{openPercentage}%</p> {/* Exibe a percentagem de abertura */}
        </div>
    );
}