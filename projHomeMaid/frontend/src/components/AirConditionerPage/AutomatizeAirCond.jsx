import React, { useState } from "react";

export default function AutomatizeAirConditioner() {
    const [automatizations, setAutomatizations] = useState([]);
    const [isAutomatizeOn, setIsAutomatizeOn] = useState(true);
    const [onTime, setOnTime] = useState("08:00");
    const [offTime, setOffTime] = useState("18:00");
    const [temperature, setTemperature] = useState(24); // Temperatura padrão

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const handleOffTimeChange = (e) => {
        setOffTime(e.target.value);
    };

    const handleTemperatureChange = (e) => {
        setTemperature(Number(e.target.value));
    };

    const addAutomatization = () => {
        const newAutomatization = {
            onTime,
            offTime,
            temperature,
        };
        setAutomatizations([...automatizations, newAutomatization]);
    };

    const deleteAutomatization = (index) => {
        setAutomatizations(automatizations.filter((_, i) => i !== index));
    };

    // Gerar opções de temperatura (12 a 32 graus Celsius)
    const temperatureOptions = Array.from({ length: 32 - 12 + 1 }, (_, i) => 12 + i);

    return (
        <div className="flex flex-col items-center w-full">
            {/* Contêiner de Automatização */}
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize</h2>
                </div>

                {isAutomatizeOn && (
                    <div className="space-y-4">
                        {/* Entrada de Hora - On e Off */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <label className="text-gray-600 font-medium">On</label>
                                <input
                                    type="time"
                                    value={onTime}
                                    onChange={handleOnTimeChange}
                                    className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 font-medium">Off</label>
                                <input
                                    type="time"
                                    value={offTime}
                                    onChange={handleOffTimeChange}
                                    className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Controle de Temperatura */}
                        <div className="flex flex-col items-center">
                            <label className="text-gray-600 font-medium">Temperature</label>
                            <select
                                value={temperature}
                                onChange={handleTemperatureChange}
                                className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                {temperatureOptions.map((temp) => (
                                    <option key={temp} value={temp}>
                                        {temp}°C
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Automatizações */}
            {isAutomatizeOn && automatizations.length > 0 && (
                <div className="w-full space-y-3">
                    {automatizations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
                        >
                            <div className="text-sm">
                                <span className="block font-medium">
                                    On: <span className="font-semibold">{item.onTime}</span>
                                </span>
                                <span className="block font-medium">
                                    Off: <span className="font-semibold">{item.offTime}</span>
                                </span>
                                <span className="block font-medium">
                                    Temp: <span className="font-semibold">{item.temperature}°C</span>
                                </span>
                            </div>
                            <button
                                onClick={() => deleteAutomatization(index)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                                aria-label="Delete"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Botão de Adicionar Automatização */}
            {isAutomatizeOn && (
                <button
                    onClick={addAutomatization}
                    className="mt-6 w-14 h-14 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none"
                >
                    +
                </button>
            )}
        </div>
    );
}
