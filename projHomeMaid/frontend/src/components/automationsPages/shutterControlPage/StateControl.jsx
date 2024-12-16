import React, { useEffect, useState } from "react";
import fullsunIcon from "../../../assets/automationsPages/stateIcons/suns/fullSun.png"; // Ícone para abertura máxima
import outlineSunIcon from "../../../assets/automationsPages/stateIcons/suns/outlineSun.png"; // Ícone para abertura mínima
import shutteropen from "../../../assets/automationsPages/devices/shutter/shutter_open.png"; // Ícone para persiana aberta
import shutterclosed from "../../../assets/automationsPages/devices/shutter/shutter_closed.png"; // Ícone para persiana fechada
import { useNavigate } from "react-router-dom"; // Import for redirecting to login

export default function StateControl({ deviceId }) {
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(100); // Valor padrão de abertura
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    // Fetch initial data from backend
    useEffect(() => {
        const fetchShutterData = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.log("Token not found. Redirecting to login page.");
                navigate("/login");
                return;
            }
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`,
                    {
                        method : "GET",
                        headers : {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                const data = await response.json();

                if (data.state !== undefined) setIsShutterOpen(data.state);
                if (data.openPercentage !== undefined) setOpenPercentage(data.openPercentage);
                if(response.ok){
                    console.log("Fetched Data Successfully");
                }else if (response.status === 403){
                    console.log("Unauthorized access");
                    navigate("/login")
                }
            } catch (err) {
                console.error("Erro ao buscar dados do backend:", err);
                setError("Falha ao buscar os dados da persiana.");
            }
        };

        fetchShutterData();
    }, [deviceId]);

    // Save data to backend
    const saveStateToBackend = async (state, percentage) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.log("Token not found. Redirecting to login page.");
                navigate("/login");
                return;
            }
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state, openPercentage: percentage }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar estado: ${response.status}`);
            }else {
                console.log("Saved Data Successfully");
            }
        } catch (err) {
            console.error("Erro ao salvar estado no backend:", err);
            setError("Falha ao salvar o estado.");
        }
    };

    // Handle toggle shutter state
    const toggleShutter = async () => {
        const updatedState = !isShutterOpen;
        const updatedPercentage = updatedState ? 100 : 0; // Abrir = 100%, Fechar = 0%

        try {
            await saveStateToBackend(updatedState, updatedPercentage);
            setIsShutterOpen(updatedState);
            setOpenPercentage(updatedPercentage);
        } catch (err) {
            console.error("Erro ao alternar o estado da persiana:", err);
            setError("Falha ao alternar a persiana.");
        }
    };

    // Handle percentage update
    const updateOpenPercentage = async (percentage) => {
        const parsedPercentage = Number(percentage);

        try {
            setOpenPercentage(parsedPercentage);
            if (isShutterOpen) {
                await saveStateToBackend(true, parsedPercentage);
            }
        } catch (err) {
            console.error("Erro ao atualizar a percentagem de abertura:", err);
            setError("Falha ao atualizar a percentagem.");
        }
    };

    return (
        <div className="flex flex-col items-center mt-6">
            {/* Botão de Estado da Persiana */}
            <button
                onClick={toggleShutter}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                {/* Fundo da persiana */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                {/* Ícone da persiana */}
                <div className="z-10">
                    {isShutterOpen ? (
                        <img src={shutteropen} alt="Open Shutter" className="w-20 h-20" />
                    ) : (
                        <img src={shutterclosed} alt="Closed Shutter" className="w-20 h-20" />
                    )}
                </div>
            </button>

            {/* Seletor de Estado */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isShutterOpen ? "Open" : "Closed"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-yellow-500"
                    checked={isShutterOpen}
                    onChange={toggleShutter}
                />
            </div>

            {/* Controle de Percentagem de Abertura */}
            <div
                className={`mt-6 w-60 text-center ${
                    isShutterOpen ? "" : "opacity-50 pointer-events-none"
                }`}
            >
                <div className="flex justify-between items-center">
                    {/* Ícone para abertura mínima */}
                    <img src={outlineSunIcon} alt="Closed Shutter" className="w-11 h-11" />

                    {/* Slider */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={openPercentage}
                        onChange={(e) => updateOpenPercentage(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FACC15 ${openPercentage}%, #e5e7eb ${openPercentage}%)`, // Efeito visual no slider
                        }}
                    />
                    {/* Ícone para abertura máxima */}
                    <img src={fullsunIcon} alt="Open Shutter" className="w-11 h-11" />
                </div>
                <p className="text-white-500 mt-0">{openPercentage}%</p>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Exibição de erros */}
        </div>
    );
}
