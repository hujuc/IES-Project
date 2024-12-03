import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import CentralControl from "../components/coffeeMachinePage/CentralControl.jsx";
import DrinkOptions from "../components/coffeeMachinePage/DrinkOptions.jsx";
import Automatize from "../components/coffeeMachinePage/AutomatizeCoffee.jsx";
import { useParams } from "react-router-dom";

export default function CoffeeMachineControl() {
    const { deviceId } = useParams();
    const [deviceState, setDeviceState] = useState(false); // Estado da Coffee Machine
    const [error, setError] = useState(null);

    const fetchDeviceState = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
            const data = await response.json();
            setDeviceState(data.state || false);
        } catch (err) {
            console.error("Erro ao buscar o estado da máquina de café:", err);
            setError("Falha ao buscar o estado da máquina de café.");
        }
    };

    // Busca inicial e configuração do intervalo de atualização
    useEffect(() => {
        fetchDeviceState();
        const intervalId = setInterval(fetchDeviceState, 5000);

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, [deviceId]);

    return (
        <div
            className="relative flex flex-col items-center w-screen min-h-screen"
            style={{ backgroundColor: "#2C2A28" }}
        >
            {/* Back Button */}
            <div className="absolute top-4 left-3 h-16 w-16">
                <GetBackButton />
            </div>

            {/* Three Dots Button */}
            <div className="absolute top-4 right-1 h-12 w-14">
                <EllipsisButton />
            </div>

            {/* Coffee Machine Title */}
            <div className="mt-16 flex items-center justify-center">
                <div className="form-control w-60">
                    <label className="label cursor-pointer">
                        <span className="label-text text-2xl font-semibold text-white">
                            Coffee Machine
                        </span>
                        <input
                            type="checkbox"
                            className="toggle bg-gray-400 checked:bg-orange-500"
                            checked={deviceState}
                            readOnly
                        />
                    </label>
                </div>
            </div>

            {/* Central Control */}
            <div className="mt-8">
                <CentralControl deviceId={deviceId} />
            </div>

            {/* Drink Options */}
            <div className="mt-8">
                <DrinkOptions deviceId={deviceId} />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <Automatize deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
