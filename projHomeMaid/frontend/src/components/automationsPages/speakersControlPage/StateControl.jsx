import React from "react";
import speakerOnIcon from "../../../assets/alarm-clock.png"; // Ícone para Speaker ligado
import speakerOffIcon from "../../../assets/alarm-clock.png"; // Ícone para Speaker desligado

export default function StateControl({ isSpeakerOn, toggleSpeaker }) {
    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={() => toggleSpeaker()}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                {/* Fundo do Speaker */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Ícone do Speaker */}
                <div className="z-10">
                    {isSpeakerOn ? (
                        <img src={speakerOnIcon} alt="Speaker On" className="w-20 h-20" />
                    ) : (
                        <img src={speakerOffIcon} alt="Speaker Off" className="w-20 h-20" />
                    )}
                </div>
            </button>
            {/* Seletor do estado */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isSpeakerOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-yellow-500"
                    checked={isSpeakerOn}
                    onChange={() => toggleSpeaker()}
                />
            </div>
        </div>
    );
}
