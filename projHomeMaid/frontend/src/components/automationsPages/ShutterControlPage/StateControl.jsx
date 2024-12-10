import React from "react";
import shutteropen from "../../../assets/shutter_open.png"; // Ícone para persiana aberta
import shutterclosed from "../../../assets/shutter_closed.png"; // Ícone para persiana fechada

export default function StateControl({ isShutterOpen, toggleShutter }) {
    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={() => toggleShutter()}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                {/* Fundo da persiana */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Ícone da persiana */}
                <div className="z-10">
                    {isShutterOpen ? (
                        <img src={shutteropen} alt="Open Shutter" className="w-20 h-20" />
                    ) : (
                        <img src={shutterclosed} alt="Closed Shutter" className="w-20 h-20" />
                    )}
                </div>
            </button>
            {/* Seletor do estado */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">Open</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-yellow-500"
                    checked={isShutterOpen}
                    onChange={() => toggleShutter()}
                />
            </div>
        </div>
    );
}
