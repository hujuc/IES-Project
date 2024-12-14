import React from "react";
import heatedOnIcon from "../../../assets/automationsPages/devices/heatedFloor/heatedFloorsOn.png"; // Ícone para aquecimento ligado
import heatedOffIcon from "../../../assets/automationsPages/devices/heatedFloor/heatedFloorsOff.png"; // Ícone para aquecimento desligado

export default function StateControl({ isHeatedOn, toggleHeatedFloors }) {
    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={() => toggleHeatedFloors()}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                {/* Fundo do botão */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Ícone do estado */}
                <div className="z-10">
                    {isHeatedOn ? (
                        <img src={heatedOnIcon} alt="Heated On" className="w-20 h-20" />
                    ) : (
                        <img src={heatedOffIcon} alt="Heated Off" className="w-20 h-20" />
                    )}
                </div>
            </button>
            {/* Controle de estado */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isHeatedOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={isHeatedOn}
                    onChange={() => toggleHeatedFloors()}
                />
            </div>
        </div>
    );
}
