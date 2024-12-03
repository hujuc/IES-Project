import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import { FiZapOff, FiZap } from "react-icons/fi";
import AutomatizeLight from "../components/LightBulbPage/AutomatizeLight.jsx";

import outlineSunIcon from "../assets/outlineSun.png";
import fullSunIcon from "../assets/fullSun.png";

export default function LightBulbControl() {
    const [isLightOn, setIsLightOn] = useState(false);
    const [brightness, setBrightness] = useState(50); // Brilho padrão
    const [color, setColor] = useState("#ffffff"); // Cor padrão (branca)
    const [error, setError] = useState(null);

    // Obter ID do dispositivo da URL
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1];

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


    // Buscar o estado inicial da lâmpada
    useEffect(() => {
        const fetchLightData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                // Atualizar os estados com os valores retornados do backend
                setIsLightOn(data.state || false); // Estado inicial
                setBrightness(data.brightness || 50); // Brilho inicial
                setColor(data.color || "#ffffff"); // Cor inicial
            } catch (err) {
                console.error("Erro ao buscar o estado da lâmpada:", err);
                setError("Falha ao buscar o estado da lâmpada.");
            }
        };

        fetchLightData();
    }, [deviceId]);

    // Alternar o estado da lâmpada
    const toggleLight = async () => {
        try {
            const updatedState = !isLightOn;
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state: updatedState }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            console.log(`Estado da lâmpada atualizado na API para: ${updatedState}`);
            setIsLightOn(updatedState);
        } catch (err) {
            console.error("Erro ao alternar a luz:", err);
            setError("Falha ao alternar a luz.");
        }
    };

    // Atualizar o brilho
    const updateBrightness = async (newBrightness) => {
        try {
            setBrightness(newBrightness);

            if (isLightOn) {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ brightness: newBrightness }),
                });

                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status}`);
                }

                console.log(`Brilho atualizado na API para: ${newBrightness}`);
            }
        } catch (err) {
            console.error("Erro ao atualizar o brilho:", err);
            setError("Falha ao atualizar o brilho.");
        }
    };

    // Atualizar a cor
    const updateColor = async (newColor) => {
        try {
            setColor(newColor);

            if (isLightOn) {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ color: newColor }),
                });

                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status}`);
                }

                console.log(`Cor atualizada na API para: ${newColor}`);
            }
        } catch (err) {
            console.error("Erro ao atualizar a cor:", err);
            setError("Falha ao atualizar a cor.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                <div className="h-16 w-16">
                    <GetBackButton/>
                </div>
                <div className="h-12 w-14">
                    <EllipsisButton/>
                </div>
            </div>
            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-2xl font-semibold">Lamp</span>
            </div>

            {/* Seletor do estado da lâmpada */}
            <div className="flex flex-col items-center mt-6">
                <button
                    onClick={toggleLight}
                    className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
                >
                    {/* Fundo da lâmpada */}
                    <div
                        className={`absolute w-32 h-32 rounded-full border-4 ${
                            isLightOn ? `bg-yellow-500 opacity-${Math.floor(brightness / 10)}` : "bg-gray-300"
                        }`}
                        style={{backgroundColor: isLightOn ? color : "#ccc"}}
                    ></div>
                    {/* Ícone da lâmpada */}
                    <div className="z-10">
                        {isLightOn ? (
                            <FiZap size={50} className="text-black"/>
                        ) : (
                            <FiZapOff size={50} className="text-gray-400"/>
                        )}
                    </div>
                </button>
                {/* Seletor do estado */}
                <div className="mt-4 flex items-center">
                    <span className="text-lg font-medium mr-3">Light</span>
                    <input
                        type="checkbox"
                        className="toggle bg-gray-300 checked:bg-yellow-500"
                        checked={isLightOn}
                        onChange={toggleLight}
                    />
                </div>
            </div>

            {/* Slider de brilho */}
            <div className={`mt-6 w-60 text-center ${isLightOn ? "" : "opacity-50 pointer-events-none"}`}>
                <div className="flex justify-between items-center">
                    {/* Ícone para brilho mínimo */}
                    <img src={outlineSunIcon} alt="Low Brightness" className="w-11 h-11"/>

                    {/* Slider */}
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={brightness}
                        onChange={(e) => updateBrightness(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FACC15 ${brightness}%, #e5e7eb ${brightness}%)`,
                        }}
                    />
                    {/* Ícone para brilho máximo */}
                    <img src={fullSunIcon} alt="High Brightness" className="w-11 h-11"/>
                </div>
                <p className="text-white-500 mt-0">{brightness}%</p>
            </div>

            {/* Controle de cor */}
            <div className={`mt-6 w-60 text-center ${isLightOn ? "" : "opacity-50 pointer-events-none"}`}>
                <label className="text-lg font-medium mb-2 block">Color</label>
                <div className="flex justify-center flex-wrap gap-2">
                    {predefinedColors.map((colorOption) => (
                        <button
                            key={colorOption.value}
                            style={{backgroundColor: colorOption.value}}
                            className={`w-6 h-6 rounded-full border-2 ${
                                color === colorOption.value ? "border-white" : "border-transparent"
                            }`}
                            onClick={() => updateColor(colorOption.value)}
                        />
                    ))}
                </div>
            </div>


            {/* Automatização */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"}}
                >
                    <AutomatizeLight deviceId={deviceId}/>
                </div>
            </div>
        </div>
    );
}
