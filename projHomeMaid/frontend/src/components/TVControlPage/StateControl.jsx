import React from "react";
import tvOnIcon from "../../assets/TVon.png"; // Ícone para TV ligada
import tvOffIcon from "../../assets/TVoff.png"; // Ícone para TV desligada

export default function StateControl({ isTVOn, toggleTV }) {
    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={toggleTV}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                {/* Fundo da TV */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Ícone da TV */}
                <div className="z-10">
                    <img
                        src={isTVOn ? tvOnIcon : tvOffIcon}
                        alt={isTVOn ? "TV On" : "TV Off"}
                        className="w-20 h-20"
                    />
                </div>
            </button>
            {/* Switch */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isTVOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-yellow-500"
                    checked={isTVOn}
                    onChange={toggleTV}
                />
            </div>
        </div>
    );
}
