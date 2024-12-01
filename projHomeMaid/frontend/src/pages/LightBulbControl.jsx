import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import { FiZapOff, FiZap } from "react-icons/fi"; // Ícones de lâmpada apagada e acesa
import Automatize from "../components/LightBulbPage/AutomatizeLight.jsx";

export default function LightBulbControl() {
    const [isLightOn, setIsLightOn] = useState(false);
    const [error, setError] = useState(null);
    const deviceId = "Light001"; // Substituir por ID dinâmico se necessário.

    // Buscar o estado inicial da lâmpada
    useEffect(() => {
        const fetchLightState = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();
                setIsLightOn(data.state || false); // Assume que está apagada se o estado for null/undefined
            } catch (err) {
                console.error("Erro ao buscar o estado da lâmpada:", err);
                setError("Falha ao buscar o estado da lâmpada.");
            }
        };

        fetchLightState();
    }, [deviceId]);

    // Alternar o estado da lâmpada
    const toggleLight = async () => {
        try {
            const updatedState = !isLightOn;
            await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state: updatedState }),
            });
            setIsLightOn(updatedState);
        } catch (err) {
            console.error("Erro ao alternar a luz:", err);
            setError("Falha ao alternar a luz.");
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

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
                        className={`absolute w-24 h-24 rounded-full ${
                            isLightOn ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                    ></div>
                    {/* Ícone da lâmpada */}
                    <div className="z-10">
                        {isLightOn ? (
                            <FiZap size={40} className="text-yellow-600"/>
                        ) : (
                            <FiZapOff size={40} className="text-gray-400"/>
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


            {/* Seção de Automatização */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"}}
                >
                    <Automatize deviceId={deviceId}/>
                </div>
            </div>
        </div>
    );
}
