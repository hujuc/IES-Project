import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AutomationsHeader() {
    const navigate = useNavigate(); // Para redirecionar após remoção
    const url = window.location.href;
    const urlParts = url.split("/");
    const deviceId = urlParts[urlParts.length - 1]; // Pega o deviceId do URL

    const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

    const handleRemoveDevice = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deviceId }), // Envia o deviceId no corpo
            });

            if (response.ok) {
                const houseId = deviceId.split("_")[2]; // Extrair o `houseId` do deviceId
                navigate(`/homePage/${houseId}`); // Redireciona para a homePage da casa
            } else {
                console.log("Failed to remove device. Please try again.");
            }
        } catch (error) {
            console.error("Error removing device:", error);
            console.log("An error occurred. Please try again.");
        }
    };

    return (
        <div className="w-full flex justify-between px-4 py-4">
            <div className="h-16 w-16">
                {/* Botão para voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
                >
                    Back
                </button>
            </div>
            <div>
                {/* Botão para abrir o modal de confirmação */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                >
                    Remove
                </button>
            </div>

            {/* Modal de Confirmação */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="flex justify-center items-center fixed inset-0 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Confirm Device Removal</h2>
                    <p className="text-gray-600 mt-4">
                        Are you sure you want to remove this device? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4 mt-6">
                        {/* Botão Cancelar */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        {/* Botão Confirmar */}
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                handleRemoveDevice();
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
