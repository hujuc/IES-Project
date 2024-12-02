    import React, { useState, useEffect } from "react";
    import GetBackButton from "../components/buttons/GetBackButton.jsx";
    import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
    import { FiZapOff, FiZap } from "react-icons/fi";
    import AutomatizeLight from "../components/LightBulbPage/AutomatizeLight.jsx";

    import outlineSunIcon from "../assets/outlineSun.png";
    import fullSunIcon from "../assets/fullSun.png";

    export default function LightBulbControl() {
        const [isLightOn, setIsLightOn] = useState(false);
        const [brightness, setBrightness] = useState(50); // Brilho padrão (50%)
        const [error, setError] = useState(null);
        const deviceId = "Light001";

        // Buscar o estado inicial da lâmpada e o brilho
        useEffect(() => {
            const fetchLightData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                    const data = await response.json();
                    setIsLightOn(data.state || false); // Assume apagada se estado for null/undefined
                    setBrightness(data.brightness || 50); // Brilho padrão se não especificado
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
                console.log("Toggling light state to:", updatedState); // Log do novo estado
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

                console.log("API response:", await response.json());
                setIsLightOn(updatedState);
            } catch (err) {
                console.error("Erro ao alternar a luz:", err);
                setError("Falha ao alternar a luz.");
            }
        };


        // Atualizar o brilho
        const updateBrightness = async (newBrightness) => {
            try {
                console.log("Updating brightness to:", newBrightness); // Log do novo brilho
                setBrightness(newBrightness); // Atualizar localmente

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

                    console.log("Brightness updated successfully. API response:", await response.json());
                }
            } catch (err) {
                console.error("Erro ao atualizar o brilho:", err);
                setError("Falha ao atualizar o brilho.");
            }
        };


        return (
            <div
                className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white"
            >
                {/* Top Bar */}
                <div className="w-full flex justify-between px-6 py-4 items-center">
                    <div className="h-16 w-16">
                        <GetBackButton/>
                    </div>
                    <span className="text-3xl font-semibold">Light Bulb</span>
                    <div className="h-12 w-14">
                        <EllipsisButton/>
                    </div>
                </div>

                {/* Seletor do estado da lâmpada */}
                <div className="flex flex-col items-center mt-6">
                    <button
                        onClick={toggleLight}
                        className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
                    >
                        {/* Fundo da lâmpada */}
                        <div
                            className={`absolute w-32 h-32 rounded-full ${
                                isLightOn ? `bg-yellow-500 opacity-${Math.floor(brightness / 10)}` : "bg-gray-300"
                            }`}
                        ></div>
                        {/* Ícone da lâmpada */}
                        <div className="z-10">
                            {isLightOn ? (
                                <FiZap size={50} className="text-yellow-600"/>
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
                                background: `linear-gradient(to right, #FACC15 ${brightness}%, #e5e7eb ${brightness}%)`, // Efeito visual no slider
                            }}
                        />
                        {/* Ícone para brilho máximo */}
                        <img src={fullSunIcon} alt="High Brightness" className="w-11 h-11"/>
                    </div>
                    <p className="text-white-500 mt-0">{brightness}%</p> {/* Exibe a porcentagem do brilho */}
                </div>


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
