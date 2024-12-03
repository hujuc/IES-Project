import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/speakersControlPage/StateControl.jsx";
import VolumeControl from "../components/speakersControlPage/VolumeControl.jsx";
import AutomatizeSpeaker from "../components/speakersControlPage/AutomatizeSpeaker.jsx";

export default function SpeakerControl() {
    const DEFAULT_VOLUME = 50;
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    const fetchSpeakerData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
            const data = await response.json();

            setIsSpeakerOn(data.state || false);
            const initialVolume = data.volume != null ? Number(data.volume) : DEFAULT_VOLUME;
            setVolume(initialVolume);
        } catch (err) {
            console.error("Erro ao buscar o estado do speaker:", err);
            setError("Falha ao buscar o estado do speaker.");
        }
    };

    // Buscar o estado inicial e configurar o intervalo de atualização
    useEffect(() => {
        fetchSpeakerData(); // Busca inicial
        const intervalId = setInterval(fetchSpeakerData, 5000); // Atualiza a cada 5 segundos

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
    }, [deviceId]);

    const toggleSpeaker = async () => {
        try {
            const updatedState = !isSpeakerOn;

            await saveStateToDatabase(updatedState, volume);
            setIsSpeakerOn(updatedState);
        } catch (err) {
            console.error("Erro ao alternar o estado do speaker:", err);
            setError("Falha ao alternar o estado do speaker.");
        }
    };

    const updateVolume = async (newVolume) => {
        try {
            const volumeNumber = Number(newVolume);
            setVolume(volumeNumber);

            if (isSpeakerOn) {
                await saveStateToDatabase(true, volumeNumber);
            }
        } catch (err) {
            console.error("Erro ao atualizar o volume:", err);
            setError("Falha ao atualizar o volume.");
        }
    };

    const saveStateToDatabase = async (state, volume) => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, volume }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            console.log("Estado e volume salvos com sucesso:", { state, volume });
        } catch (err) {
            console.error("Erro ao salvar estado e volume na base de dados:", err);
            setError("Falha ao salvar estado e volume na base de dados.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Speaker</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* State Control */}
            <StateControl isSpeakerOn={isSpeakerOn} toggleSpeaker={toggleSpeaker} />

            {/* Volume Control */}
            <VolumeControl isSpeakerOn={isSpeakerOn} volume={volume} updateVolume={updateVolume} />

            {/* Automatization Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeSpeaker deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
