import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


export default function AutomatizeLight() {
    const predefinedColors = [
        { name: "White", value: "#ffffff" },
        { name: "Red", value: "#ff0000" },
        { name: "Pink", value: "#ffc0cb" },
        { name: "Orange", value: "#ffa500" },
        { name: "Warm White", value: "#ffd700" },
        { name: "Yellow", value: "#ffff00" },
        { name: "Green", value: "#00ff00" },
        { name: "Teal", value: "#008080" },
        { name: "Light Blue", value: "#add8e6" },
        { name: "Blue", value: "#0000ff" },
        { name: "Purple", value: "#800080" },
    ];

    const [automatizations, setAutomatizations] = useState([
        { time: "08:00 AM", brightness: 50, color: "White", action: "Turn On" }, // Automatização inicial
    ]);
    const [isAutomatizeOn, setIsAutomatizeOn] = useState(true); // Estado do toggle
    const [onTime, setOnTime] = useState("08:00"); // Tempo de ativação
    const [brightness, setBrightness] = useState(50); // Nível de brilho
    const [colorIndex, setColorIndex] = useState(0); // Índice da cor selecionada
    const [action, setAction] = useState("Turn On"); // Estado da ação

    const handleOnTimeChange = (e) => {
        setOnTime(e.target.value);
    };

    const handleNextColor = () => {
        setColorIndex((prevIndex) => (prevIndex + 1) % predefinedColors.length);
    };

    const handlePreviousColor = () => {
        setColorIndex((prevIndex) =>
            prevIndex === 0 ? predefinedColors.length - 1 : prevIndex - 1
        );
    };

    const addAutomatization = () => {
        const newAutomatization = {
            time: onTime,
            brightness,
            color: predefinedColors[colorIndex].name,
            action,
        };
        setAutomatizations([...automatizations, newAutomatization]);
    };

    const toggleAutomatization = () => {
        setIsAutomatizeOn((prev) => !prev);
    };

    const deleteAutomatization = (index) => {
        setAutomatizations(automatizations.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Contêiner de Automatização */}
            <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Automatize</h2>
                </div>

                {isAutomatizeOn && (
                    <div className="space-y-4">
                        {/* Entrada de Hora */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">On</label>
                            <input
                                type="time"
                                value={onTime}
                                onChange={handleOnTimeChange}
                                className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                        {/* Ação Turn On/Off */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Action</label>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-32 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="Turn On">Turn On</option>
                                <option value="Turn Off">Turn Off</option>
                            </select>
                        </div>

                        {/* Controle de Brilho */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Brightness</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                                className="w-32 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-gray-700 font-medium">{brightness}%</span>
                        </div>

                        {/* Seleção de Cor com Setas */}
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-medium">Color</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    className="text-gray-600 hover:text-gray-800 focus:outline-none w-8 h-8 flex items-center justify-center"
                                    onClick={handlePreviousColor}
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <div
                                    //mete border cinza escuro
                                    className="w-16 h-8 rounded-full border-2 border-gray-300"
                                    style={{
                                        backgroundColor: predefinedColors[colorIndex].value,
                                    }}
                                ></div>
                                <button
                                    className="text-gray-600 hover:text-gray-800 focus:outline-none w-8 h-8 flex items-center justify-center"
                                    onClick={handleNextColor}
                                >
                                    <FaChevronRight size={20} />
                                </button>

                            </div>
                        </div>


                    </div>
                )}
            </div>

            {/* Lista de Automatizações */}
            {isAutomatizeOn && (
                <div className="w-full space-y-3">
                    {automatizations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
                        >
                            <div className="text-sm">
                                <span className="block font-medium">
                                    Time: <span className="font-semibold">{item.time}</span>
                                </span>
                                <span className="block font-medium">
                                    Brightness: <span className="font-semibold">{item.brightness}%</span>
                                </span>
                                <span className="block font-medium">
                                    Color: <span className="font-semibold">{item.color}</span>
                                </span>
                                <span className="block font-medium">
                                    Action: <span className="font-semibold">{item.action}</span>
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
                    className="mt-6 w-14 h-14 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    +
                </button>
            )}
        </div>
    );
}
