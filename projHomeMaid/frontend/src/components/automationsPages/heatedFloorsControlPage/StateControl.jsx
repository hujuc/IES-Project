import React from "react";
import heatedOnIcon from "../../../assets/automationsPages/devices/heatedFloor/heatedFloorsOn.png"; // Ícone para aquecimento ligado
import heatedOffIcon from "../../../assets/automationsPages/devices/heatedFloor/heatedFloorsOff.png"; // Ícone para aquecimento desligado
import lowHeatIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png"; // Ícone para baixa temperatura
import highHeatIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png"; // Ícone para alta temperatura

export default function StateControl({
                                         isHeatedOn,
                                         toggleHeatedFloors,
                                         temperature,
                                         updateTemperature,
                                     }) {
    return (
        <div className="flex flex-col items-center mt-6">
            {/* Botão de Ligar/Desligar */}
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

            {/* Controle de Temperatura */}
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
        </div>
    );
}
