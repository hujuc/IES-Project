import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import RoomInfo from "./RoomInfo";

// Imagens padrão para cada tipo de divisão
import HouseImage from "../../assets/homePage/roomsImages/house.jpg";
import BedroomImage from "../../assets/homePage/roomsImages/bedroom.jpg";
import KitchenImage from "../../assets/homePage/roomsImages/kitchen.jpg";
import LivingRoomImage from "../../assets/homePage/roomsImages/livingRoom.jpg";
import HallImage from "../../assets/homePage/roomsImages/hall.jpg";
import LaundryImage from "../../assets/homePage/roomsImages/laundry.jpg";
import OfficeImage from "../../assets/homePage/roomsImages/office.jpg";
import BathroomImage from "../../assets/homePage/roomsImages/bathroom.jpg";
import GuestBedroomImage from "../../assets/homePage/roomsImages/guestBedroom.jpg";

Modal.setAppElement("#root");

function CardSlider() {
    const { houseId } = useParams(); // Obter houseId do URL
    const [cards, setCards] = useState([]); // Dados dos cards
    const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do slider
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
    const [deviceData, setDeviceData] = useState({ name: "", type: "", room: "" }); // Dados do novo dispositivo

    // Tipos de dispositivos permitidos
    const deviceTypes = [
        "airConditioner",
        "coffeeMachine",
        "heatedFloor",
        "lamp",
        "shutter",
        "stereo",
        "television",
        "washingMachine",
        "dryerMachine",
        "clock",
    ];

    // Tipos de rooms possíveis
    const rooms = [
        "hall",
        "masterBedroom",
        "guestBedroom",
        "kitchen",
        "livingRoom",
        "bathroom",
        "office",
        "laundry",
    ];

    // Map de nomes amigáveis para os tipos de rooms
    const roomNames = {
        masterBedroom: "Master Bedroom",
        guestBedroom: "Guest Bedroom",
        kitchen: "Kitchen",
        livingRoom: "Living Room",
        hall: "Hall",
        laundry: "Laundry",
        office: "Office",
        bathroom: "Bathroom",
        house: "House",
    };

    // Ordem personalizada para exibição dos cards
    const customOrder = [
        "house",
        "hall",
        "livingRoom",
        "kitchen",
        "masterBedroom",
        "guestBedroom",
        "bathroom",
        "office",
        "laundry",
    ];

    // Buscar dados da casa ao carregar o componente
    useEffect(() => {
        const fetchHouseData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/houses/${houseId}`
                );
                if (response.ok) {
                    const data = await response.json();

                    // Criação dos cards
                    const houseCard = {
                        id: "house",
                        label: roomNames["house"],
                        image: HouseImage,
                        type: "House",
                        deviceObjects: data.devices,
                    };

                    const roomCards = data.rooms.map((room) => ({
                        id: room.type,
                        label: roomNames[room.type] || room.type,
                        image: getDefaultImage(room.type),
                        type: room.type,
                        deviceObjects: room.deviceObjects,
                    }));

                    // Ordenar os cards
                    const orderedCards = [houseCard, ...roomCards].sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.id);
                        const bIndex = customOrder.indexOf(b.id);

                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;

                        return aIndex - bIndex;
                    });

                    setCards(orderedCards);
                } else {
                    console.error("Failed to fetch house data");
                }
            } catch (error) {
                console.error("Error fetching house data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHouseData();
    }, [houseId]);

    // Função para obter a imagem padrão com base no tipo de room
    const getDefaultImage = (type) => {
        switch (type) {
            case "masterBedroom":
                return BedroomImage;
            case "guestBedroom":
                return GuestBedroomImage;
            case "kitchen":
                return KitchenImage;
            case "livingRoom":
                return LivingRoomImage;
            case "hall":
                return HallImage;
            case "laundry":
                return LaundryImage;
            case "office":
                return OfficeImage;
            case "bathroom":
                return BathroomImage;
            default:
                return HouseImage;
        }
    };

    // Função para ir ao card anterior
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? cards.length - 1 : prevIndex - 1
        );
    };

    // Função para ir ao próximo card
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Função para adicionar um novo dispositivo
    const handleAddDevice = async () => {
        try {
            if (!deviceData.name || !deviceData.type) {
                alert("Device name and type are required.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/devices/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        houseId,
                        roomType: deviceData.room || currentCard.type,
                        type: deviceData.type,
                        name: deviceData.name,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add device");
            }

            const newDevice = await response.json();
            console.log("Device created:", newDevice);

            // Atualizar os dispositivos do card atual
            const updatedCards = [...cards];
            updatedCards[currentIndex].deviceObjects = [
                ...updatedCards[currentIndex].deviceObjects,
                newDevice,
            ];
            setCards(updatedCards);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding device:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (cards.length === 0) {
        return <div>No data available</div>;
    }

    // Obter o card atual
    const currentCard = cards[currentIndex];
    const isHouse = currentCard.type === "House";

    return (
        <div className="relative flex flex-col items-center space-y-4">
            <div className="relative bg-gray-100 rounded-xl shadow-md w-96 h-64">
                <img
                    src={currentCard.image}
                    alt={currentCard.label}
                    className="w-full h-full object-cover rounded-lg p-2"
                />
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Temperature:</strong> {currentCard.temperature || "N/A"}°C
                    </div>
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Humidity:</strong> {currentCard.humidity || "N/A"}%
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setDeviceData({ name: "", type: "", room: isHouse ? "" : currentCard.type });
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600"
                    >
                        Add Device
                    </button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xl font-semibold text-white bg-black bg-opacity-50 py-1 rounded-md">
                        {currentCard.label}
                    </p>
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400"
                >
                    Next
                </button>
            </div>
            <RoomInfo room={currentCard} />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="flex justify-center items-center fixed inset-0 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-700 p-4 border-b">Add Device</h2>
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
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {isHouse ? (
                                <select
                                    value={deviceData.room}
                                    onChange={(e) => setDeviceData({ ...deviceData, room: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-2 bg-white"
                                >
                                    <option value="">Select Room</option>
                                    {rooms.map((room) => (
                                        <option key={room} value={room}>
                                            {roomNames[room]}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={currentCard.type}
                                    disabled
                                    className="border border-gray-300 rounded-lg p-2 bg-gray-200"
                                />
                            )}
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
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
        </div>
    );
}

export default CardSlider;
