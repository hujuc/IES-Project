import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RoomInfo from "./RoomInfo";

// Imagens padrão para cada tipo de divisão
import HouseImage from "../../assets/default_house.jpg";
import BedroomImage from "../../assets/default_bedroom.jpg";
import KitchenImage from "../../assets/default_kitchen.jpg";
import LivingRoomImage from "../../assets/default_living_room.jpg";
import HallImage from "../../assets/default_hall.jpg";
import LaundryImage from "../../assets/default_laundry.jpg";
import OfficeImage from "../../assets/default_office.jpg";
import BathroomImage from "../../assets/default_bathroom.jpg";

function CardSlider() {
    const { houseId } = useParams(); // Obter houseId do URL
    const [cards, setCards] = useState([]); // Armazena os dados dos cards
    const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do slider
    const [loading, setLoading] = useState(true);

    // UseEffect para buscar os dados da casa e quartos do backend
    useEffect(() => {
        const fetchHouseData = async () => {
            try {
                // Requisição ao backend para obter os dados da casa
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/houses/${houseId}`
                );
                if (response.ok) {
                    const data = await response.json();

                    // Formatar os dados para o slider
                    const houseCard = {
                        id: "house",
                        label: "Home",
                        temperature: data.temperature,
                        humidity: data.humidity,
                        image: HouseImage, // Usar imagem padrão para a casa
                        type: "House",
                        deviceObjects: data.devices, // Passar os dispositivos da casa
                    };

                    // Adicionar os cards dos quartos
                    const roomCards = data.rooms.map((room) => ({
                        id: room.roomId,
                        label: room.type,
                        temperature: room.temperature,
                        humidity: room.humidity,
                        image: getDefaultImage(room.type),
                        type: room.type,
                        deviceObjects: room.deviceObjects, // AQUI também usamos deviceObjects
                    }));

                    // Adicionar o card da casa e os quartos
                    setCards([houseCard, ...roomCards]);
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
        const roomType = type.toLowerCase();

        switch (roomType) {
            case "bedroom":
                return BedroomImage;
            case "kitchen":
                return KitchenImage;
            case "living room":
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
                        <strong>Temperature:</strong> {cards[currentIndex].temperature}°C
                    </div>
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Humidity:</strong> {cards[currentIndex].humidity}%
                    </div>
                </div>

                {/* Título no centro inferior */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xl font-semibold text-white bg-black bg-opacity-50 py-1 rounded-md">
                        {cards[currentIndex].type}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={handlePrev}
                    style={{
                        backgroundColor: "#d1d5db", // bg-gray-300
                        color: "#374151", // text-gray-700
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        cursor: "pointer",
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent active state on click
                    onFocus={(e) => e.target.blur()} // Remove focus after click
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    style={{
                        backgroundColor: "#d1d5db", // bg-gray-300
                        color: "#374151", // text-gray-700
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        cursor: "pointer",
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent active state on click
                    onFocus={(e) => e.target.blur()} // Remove focus after click
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
