import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

function CardSlider() {
    const { houseId } = useParams(); // Obter houseId do URL
    const [cards, setCards] = useState([]); // Armazena os dados dos cards
    const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do slider
    const [loading, setLoading] = useState(true);

    // Mapeamento de tipos de divisões para os nomes personalizados
    const roomNames = {
        "masterBedroom": "Master Bedroom",
        "guestBedroom": "Guest Bedroom",
        "kitchen": "Kitchen",
        "livingRoom": "Living Room",
        "hall": "Hall",
        "laundry": "Laundry",
        "office": "Office",
        "bathroom": "Bathroom",
        "house": "House", // Aqui também pode ser o nome da casa, por exemplo.
    };

    // Definir a ordem dos cards (com base no ID ou tipo)
    const customOrder = [
        "house",
        "hall",
        "livingRoom",
        "kitchen",
        "masterBedroom",
        "guestBedroom",
        "bathroom",
        "office",
        "laundry"
    ];

    // UseEffect para buscar os dados da casa e quartos do backend
    useEffect(() => {
        const fetchHouseData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/houses/${houseId}`
                );
                if (response.ok) {
                    const data = await response.json();

                    const houseCard = {
                        id: "house", // ID da casa
                        label: roomNames["house"], // Usar o nome do mapeamento para a casa
                        image: HouseImage,
                        type: "House",
                        deviceObjects: data.devices,
                    };

                    const roomCards = data.rooms.map((room) => ({
                        id: room.type, // Certifique-se de que o `type` esteja no customOrder
                        label: roomNames[room.type] || room.type, // Nome personalizado
                        image: getDefaultImage(room.type), // Imagem da divisão
                        type: room.type,
                        deviceObjects: room.deviceObjects,
                    }));

                    // Ordenar os cards com base na ordem personalizada
                    const orderedCards = [houseCard, ...roomCards].sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.id);
                        const bIndex = customOrder.indexOf(b.id);

                        // Se algum ID não for encontrado, movê-lo para o final
                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;

                        // Comparar índices para garantir a ordem personalizada
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

    // Função para verificar e retornar a imagem padrão com base no tipo de divisão
    const getDefaultImage = (type) => {
        const roomType = type;

        switch (roomType) {
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
                return HouseImage; // Imagem padrão para a casa
        }
    };

    // Funções de navegação do slider
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? cards.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Exibir mensagem de carregamento ou de dados não disponíveis
    if (loading) {
        return <div>Loading...</div>;
    }

    if (cards.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div className="relative flex flex-col items-center space-y-4">
            {/* Card Display */}
            <div className="relative bg-gray-100 rounded-xl shadow-md w-96 h-64">
                {/* Imagem */}
                <img
                    src={cards[currentIndex].image}
                    alt={cards[currentIndex].label}
                    className="w-full h-full object-cover rounded-lg p-2"
                />
                {/* Informações no canto superior esquerdo */}
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Temperature:</strong> {22}°C
                    </div>
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Humidity:</strong> {22}%
                    </div>
                </div>
                {/* Título no centro inferior */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xl font-semibold text-white bg-black bg-opacity-50 py-1 rounded-md">
                        {cards[currentIndex].label} {/* Exibindo o nome personalizado */}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
                {/* Botão Prev */}
                <button
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Prev
                </button>

                {/* Botão Next */}
                <button
                    onClick={handleNext}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Next
                </button>
            </div>

            {/* Room Info */}
            <RoomInfo room={cards[currentIndex]} />
        </div>
    );
}

export default CardSlider;
