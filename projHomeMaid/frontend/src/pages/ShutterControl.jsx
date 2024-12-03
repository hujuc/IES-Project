import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/ShutterControlPage/StateControl.jsx";
import PercentageControl from "../components/ShutterControlPage/PercentageControl.jsx";
import AutomatizeShutter from "../components/ShutterControlPage/AutomatizeShutter.jsx";

export default function ShutterControl() {
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(null);
    const [error, setError] = useState(null);

    const url = window.location.href;
    const deviceId = url.split("/").pop();

    const fetchShutterData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
            const data = await response.json();

            // Certifique-se de sincronizar os estados com o backend
            if (data.state !== undefined) {
                setIsShutterOpen(data.state);
            }

            if (data.openPercentage !== undefined) {
                setOpenPercentage(data.openPercentage); // Atualize para o valor do backend
            }
        } catch (err) {
            console.error("Erro ao buscar o estado da persiana:", err);
            setError("Falha ao buscar o estado da persiana.");
        }
    };

    useEffect(() => {
        fetchShutterData();
        const intervalId = setInterval(fetchShutterData, 5000);

        return () => clearInterval(intervalId);
    }, [deviceId]);

    const toggleShutter = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isShutterOpen;

            const targetPercentage = updatedState ? 100 : 0;

            setOpenPercentage(targetPercentage);
            await saveStateToDatabase(updatedState, targetPercentage);

            setIsShutterOpen(updatedState);
        } catch (err) {
            console.error("Erro ao alternar a persiana:", err);
            setError("Falha ao alternar a persiana.");
        }
    };

    const updateOpenPercentage = async (newPercentage) => {
        try {
            const percentageNumber = Number(newPercentage);
            setOpenPercentage(percentageNumber);

            if (isShutterOpen) {
                await saveStateToDatabase(true, percentageNumber);
            }
        } catch (err) {
            console.error("Erro ao atualizar a percentagem de abertura:", err);
            setError("Falha ao atualizar a percentagem de abertura.");
        }
    };

    const saveStateToDatabase = async (state, percentage) => {
        try {
            const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ state, openPercentage: percentage }),
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            console.log("State and percentage saved successfully:", { state, percentage });
        } catch (err) {
            console.error("Erro ao salvar estado e percentagem na base de dados:", err);
            setError("Falha ao salvar estado e percentagem na base de dados.");
        }
    };

    return (
        <div className="relative flex flex-col items-center w-screen min-h-screen bg-[#2E2A27] text-white">
            <div className="w-full flex justify-between px-6 py-4 items-center">
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                <span className="text-3xl font-semibold">Shutter</span>
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            <StateControl isShutterOpen={isShutterOpen} toggleShutter={toggleShutter} />
            <PercentageControl
                isShutterOpen={isShutterOpen}
                openPercentage={openPercentage}
                updateOpenPercentage={updateOpenPercentage}
            />

            <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
                <div
                    className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
                >
                    <AutomatizeShutter deviceId={deviceId} />
                </div>
            </div>
        </div>
    );
}
