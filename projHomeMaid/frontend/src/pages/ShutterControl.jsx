import React, { useState, useEffect } from "react";
import GetBackButton from "../components/buttons/GetBackButton.jsx";
import EllipsisButton from "../components/buttons/EllipsisButton.jsx";
import StateControl from "../components/ShutterControlPage/StateControl.jsx";
import PercentageControl from "../components/ShutterControlPage/PercentageControl.jsx";
import AutomatizeShutter from "../components/ShutterControlPage/AutomatizeShutter.jsx";

export default function ShutterControl() {
    const DEFAULT_OPEN_PERCENTAGE = 50;
    const [isShutterOpen, setIsShutterOpen] = useState(false);
    const [openPercentage, setOpenPercentage] = useState(DEFAULT_OPEN_PERCENTAGE);
    const [error, setError] = useState(null);

    const url = window.location.href;
    console.log("URL completa:", url);
    const urlParts = url.split("/");
    console.log("Partes do URL:", urlParts);
    const deviceId = urlParts[urlParts.length - 1];
    console.log("Device ID:", deviceId);

    // Buscar o estado inicial
    useEffect(() => {
        const fetchShutterData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`);
                const data = await response.json();

                setIsShutterOpen(data.state || false);
                const initialPercentage =
                    data.openPercentage != null
                        ? Number(data.openPercentage)
                        : DEFAULT_OPEN_PERCENTAGE;
                setOpenPercentage(initialPercentage);
            } catch (err) {
                console.error("Erro ao buscar o estado da persiana:", err);
                setError("Falha ao buscar o estado da persiana.");
            }
        };

        fetchShutterData();
    }, [deviceId]);

    useEffect(() => {
        if (openPercentage === 0 && isShutterOpen) {
            saveStateToDatabase(false, 0);
            setIsShutterOpen(false);
        }
    }, [openPercentage, isShutterOpen]);

    const toggleShutter = async (state) => {
        try {
            const updatedState = state !== undefined ? state : !isShutterOpen;

            if (updatedState) {
                setOpenPercentage(DEFAULT_OPEN_PERCENTAGE);
                await saveStateToDatabase(updatedState, DEFAULT_OPEN_PERCENTAGE);
            } else {
                setOpenPercentage(0);
                await saveStateToDatabase(updatedState, 0);
            }

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

            {/* State Control */}
            <StateControl isShutterOpen={isShutterOpen} toggleShutter={toggleShutter} />

            {/* Percentage Control */}
            <PercentageControl
                isShutterOpen={isShutterOpen}
                openPercentage={openPercentage}
                updateOpenPercentage={updateOpenPercentage}
            />

            {/* Automatization Section */}
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