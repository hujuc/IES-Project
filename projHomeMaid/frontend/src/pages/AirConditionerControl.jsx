import GetBackButton from "../components/GetBackButton.jsx";
import EllipsisButton from "../components/EllipsisButton.jsx";
import TemperatureControl from "../components/TemperatureControl.jsx";
import AirFluxControl from "../components/AirFluxControl.jsx";
import Automatize from "../components/AutomatizeAirCond.jsx";
import React, { useEffect, useState } from "react";
import "../index.css";

export default function AirConditionerControl() {
    // Estado para armazenar os dados do dispositivo
    const [deviceData, setDeviceData] = useState({});

    // Buscar dados do dispositivo da API
    useEffect(() => {
        fetch(`http://localhost:8080/api/devices/AC001`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Device data:", data);
                setDeviceData(data);
            })
            .catch((error) => console.error("Erro ao buscar dados:", error));
    }, []);

    return (
        <div
            className="flex flex-col items-center w-screen min-h-screen"
            style={{ backgroundColor: "#433F3C" }}
        >
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="form-control w-60">
                    <label className="label cursor-pointer">
                        <span className="label-text text-2xl font-semibold text-white">
                            Air Conditioner
                        </span>
                        <input
                            type="checkbox"
                            className="toggle bg-gray-300 checked:bg-orange-500"
                            checked={deviceData.state || false} // Ajuste conforme sua API
                            readOnly
                        />
                    </label>
                </div>
            </div>

            {/* Temperature Control */}
            <div className="mt-8">
                <TemperatureControl
                    initialTemperature={deviceData.temperature || 24} // Fallback para 24
                    deviceId={"AC001"} // Passando AC001 diretamente
                />
            </div>

            {/* Air Flux Control */}
            <div className="mt-8">
                <AirFluxControl />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6">
                <Automatize />
            </div>
        </div>
    );
}
