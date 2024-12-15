import React, { useState } from "react";
import Modal from "react-modal";

// Função para formatar camelCase em palavras legíveis
const formatCamelCase = (str) => {
    return str.replace(/([A-Z])/g, " $1") // Insere espaço antes das letras maiúsculas
        .replace(/^./, (char) => char.toUpperCase()) // Capitaliza a primeira letra
        .trim();
};

const AddDeviceModal = ({
                            isOpen,
                            onRequestClose,
                            deviceTypes,
                            rooms,
                            roomNames,
                            currentCard,
                            onAddDevice,
                        }) => {
    const [deviceData, setDeviceData] = useState({ name: "", type: "", room: "" });

    const handleAddDevice = () => {
        if (!deviceData.name || !deviceData.type) {
            alert("Device name and type are required.");
            return;
        }
        onAddDevice(deviceData);
        setDeviceData({ name: "", type: "", room: "" }); // Reset form
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="flex justify-center items-center fixed inset-0 z-50 p-4" // Adicionada margem (p-4)
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0">
                {/* Título do Modal */}
                <h2 className="text-xl font-semibold text-center text-gray-700 p-4 border-b">
                    Add Device
                </h2>
                <div className="bg-gray-100 p-6 rounded-b-lg">
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Device Name"
                            value={deviceData.name}
                            onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 bg-white"
                            required
                        />
                        <select
                            value={deviceData.type}
                            onChange={(e) => setDeviceData({ ...deviceData, type: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 bg-white"
                        >
                            <option value="">Select Device Type</option>
                            {deviceTypes.map((type) => (
                                <option key={type} value={type}>
                                    {formatCamelCase(type)} {/* Formata camelCase */}
                                </option>
                            ))}
                        </select>
                        {currentCard.type === "House" ? (
                            <select
                                value={deviceData.room}
                                onChange={(e) => setDeviceData({ ...deviceData, room: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 bg-white"
                            >
                                <option value="">Select Room</option>
                                {rooms.map((room) => (
                                    <option key={room} value={room}>
                                        {formatCamelCase(room)} {/* Formata camelCase */}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={formatCamelCase(currentCard.type)} // Formata o texto do card
                                disabled
                                className="border border-gray-300 rounded-lg p-2 bg-gray-200"
                            />
                        )}
                    </div>
                    {/* Botões do Modal */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={onRequestClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddDevice}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddDeviceModal;
