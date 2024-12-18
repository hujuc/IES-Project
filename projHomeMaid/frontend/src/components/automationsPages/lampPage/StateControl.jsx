import React from "react";
import { FiZapOff, FiZap } from "react-icons/fi";
import outlineSunIcon from "../../../assets/automationsPages/stateIcons/suns/outlineSun.png";
import fullSunIcon from "../../../assets/automationsPages/stateIcons/suns/fullSun.png";
import { useNavigate } from "react-router-dom"; // Import for redirecting to login

export default function StateControl({
                                         isLightOn,
                                         setIsLightOn,
                                         brightness,
                                         setBrightness,
                                         color,
                                         setColor,
                                         deviceId,
                                         error,
                                     }) {
    const predefinedColors = [
        { name: "White", value: "#ffffff" },
        { name: "Red", value: "#ff0000" },
        { name: "Pink", value: "#ffc0cb" },
        { name: "Orange", value: "#ffa500" },
        { name: "Warm Yellow", value: "#ffd700" },
        { name: "Light Yellow", value: "#ffff00" },
        { name: "Green", value: "#00ff00" },
        { name: "Teal", value: "#008080" },
        { name: "Light Blue", value: "#add8e6" },
        { name: "Blue", value: "#0000ff" },
        { name: "Purple", value: "#800080" },
    ];
    const navigate = useNavigate(); // For navigation

    // Alternar o estado da lâmpada
    const toggleLight = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            const updatedState = !isLightOn;
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state: updatedState }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            setIsLightOn(updatedState);
        } catch (err) {
            console.error("Erro ao alternar a luz:", err);
        }
    };

    const updateBrightness = async (newBrightness) => {
        try {
            setBrightness(newBrightness);
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            if (isLightOn) {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ brightness: newBrightness }),
                });

                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status}`);
                }
            }
        } catch (err) {
            console.error("Erro ao atualizar o brilho:", err);
        }
    };

    // Atualizar a cor
    const updateColor = async (newColor) => {
        try {
            setColor(newColor);
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            if (isLightOn) {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ color: newColor }),
                });

                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status}`);
                }
            }
        } catch (err) {
            console.error("Erro ao atualizar a cor:", err);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Botão de Estado */}
            <div className="flex flex-col items-center mt-8">
                <button
                    onClick={toggleLight}
                    className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
                >
                    <div
                        className={`absolute w-32 h-32 rounded-full border-4 ${
                            isLightOn ? `bg-orange-500 opacity-${Math.floor(brightness / 10)}` : "bg-gray-300"
                        }`}
                        style={{ backgroundColor: isLightOn ? color : "#ccc" }}
                    ></div>
                    <div className="z-10">
                        {isLightOn ? (
                            <FiZap size={50} className="text-black" />
                        ) : (
                            <FiZapOff size={50} className="text-gray-400" />
                        )}
                    </div>
                </button>
                <div className="mt-6 flex items-center">
                    <span className="text-lg font-medium mr-3">{isLightOn ? "On" : "Off"}</span>
                    <input
                        type="checkbox"
                        className="toggle bg-gray-300 checked:bg-orange-500"
                        checked={isLightOn}
                        onChange={toggleLight}
                    />
                </div>
            </div>

            {/* Slider de brilho */}
            <div className={`mt-6 w-60 text-center ${isLightOn ? "" : "opacity-50 pointer-events-none"}`}>
                <div className="flex justify-between items-center">
                    <img src={outlineSunIcon} alt="Low Brightness" className="w-11 h-11" />
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={brightness}
                        onChange={(e) => updateBrightness(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFA500 ${brightness}%, #e5e7eb ${brightness}%)`,
                        }}
                    />
                    <img src={fullSunIcon} alt="High Brightness" className="w-11 h-11" />
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
                            style={{ backgroundColor: colorOption.value }}
                            className={`w-6 h-6 rounded-full border-2 ${
                                color === colorOption.value ? "border-white" : "border-transparent"
                            }`}
                            onClick={() => updateColor(colorOption.value)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
