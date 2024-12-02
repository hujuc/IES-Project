import React, { useState, useEffect } from "react";
import StateControl from "../components/TVControlPage/StateControl.jsx";
import VolumeControl from "../components/TVControlPage/VolumeControl.jsx";
import BrightnessControl from "../components/TVControlPage/BrightnessControl.jsx";
import AutomatizeTV from "../components/TVControlPage/AutomatizeTV.jsx";

export default function TVControl() {
    const [isTVOn, setIsTVOn] = useState(false);
    const [volume, setVolume] = useState(50); // Volume inicial
    const [brightness, setBrightness] = useState(50); // Brilho inicial
    const [error, setError] = useState(null);

    const url = window.location.href;
    console.log("URL completa:", url);
    const urlParts = url.split("/");
    console.log("Partes do URL:", urlParts);
    const deviceId = urlParts[urlParts.length - 1];
    console.log("Device ID:", deviceId);

    // Carregar os dados iniciais da TV
    useEffect(() => {
        const fetchTVData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                // Atualizar estado, volume e brilho com os valores salvos na base de dados
                setIsTVOn(data.state || false);
                setVolume(data.volume != null ? data.volume : 50);
                setBrightness(data.brightness != null ? data.brightness : 50);
            } catch (err) {
                console.error("Erro ao buscar os dados da TV:", err);
                setError("Falha ao buscar os dados da TV.");
            }
        };

        fetchTVData();
    }, [deviceId]);

    // Alternar estado da TV
    const toggleTV = async () => {
        try {
            const updatedState = !isTVOn; // Alternar estado
            setIsTVOn(updatedState); // Atualizar localmente

            // Salvar estado na base de dados
            await saveStateToDatabase(updatedState, volume, brightness);
        } catch (err) {
            console.error("Erro ao alternar a TV:", err);
            setError("Falha ao alternar a TV.");
        }
    };

    // Atualizar volume
    const updateVolume = async (newVolume) => {
        try {
            setVolume(newVolume); // Atualizar localmente
            if (isTVOn) {
                await saveStateToDatabase(isTVOn, newVolume, brightness); // Salvar apenas se a TV estiver ligada
            }
        } catch (err) {
            console.error("Erro ao atualizar o volume:", err);
            setError("Falha ao atualizar o volume.");
        }
    };

    // Atualizar brilho
    const updateBrightness = async (newBrightness) => {
        try {
            const brightnessValue = Math.max(10, Number(newBrightness)); // Garante que o valor mínimo seja 10%
            setBrightness(brightnessValue); // Atualizar localmente

            if (isTVOn) {
                await saveStateToDatabase(isTVOn, volume, brightnessValue); // Salvar apenas se a TV estiver ligada
            }
        } catch (err) {
            console.error("Erro ao atualizar o brilho:", err);
            setError("Falha ao atualizar o brilho.");
        }
    };


    // Salvar estado, volume e brilho na base de dados
    const saveStateToDatabase = async (state, volumeValue, brightnessValue) => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    state,
                    volume: volumeValue,
                    brightness: brightnessValue,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            console.log("Estado salvo com sucesso:", { state, volumeValue, brightnessValue });
        } catch (err) {
            console.error("Erro ao salvar estado e configurações da TV na base de dados:", err);
            setError("Falha ao salvar os dados na base de dados.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            {/* Estado da TV */}
            <StateControl isTVOn={isTVOn} toggleTV={toggleTV} />

            {/* Controle de Volume */}
            <VolumeControl volume={volume} updateVolume={updateVolume} isTVOn={isTVOn} />

            {/* Controle de Brilho */}
            <BrightnessControl brightness={Math.max(brightness, 10)} updateBrightness={updateBrightness} isTVOn={isTVOn} />

            {/* Seção de Automatização */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md">
                    <AutomatizeTV deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
