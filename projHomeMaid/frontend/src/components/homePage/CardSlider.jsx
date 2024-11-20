import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RoomInfo from "./RoomInfo";

// Import das imagens padrão
import defaultHouseImage from "../../assets/default_house.jpg";
import defaultBedroomImage from "../../assets/default_bedroom.jpg";
import defaultKitchenImage from "../../assets/default_kitchen.jpg";
import defaultLivingRoomImage from "../../assets/default_living_room.jpg";

function CardSlider() {
    const { houseId } = useParams(); // Obter houseId do URL
    const [cards, setCards] = useState([]); // Armazena os dados dos cards
    const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do slider
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null); // Referência para o dropdown aberto
    const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para o dropdown

    useEffect(() => {
        // Buscar informações da casa e dos quartos
        const fetchHouseData = async () => {
            try {
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
                        image: data.imageUrl || defaultHouseImage, // Usar imagem padrão se `imageUrl` for null
                        type: "House",
                    };

                    const roomCards = data.rooms.map((room) => ({
                        id: room.roomId,
                        label: room.type,
                        temperature: room.temperature,
                        humidity: room.humidity,
                        image: getDefaultImage(room.type, room.imageUrl), // Verificar imagem padrão
                        type: room.type,
                    }));

                    setCards([houseCard, ...roomCards]); // Primeiro a casa, depois os quartos
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

    // Fechar o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Função para verificar e retornar a imagem padrão
    const getDefaultImage = (type, imageUrl) => {
        if (imageUrl) {
            return imageUrl;
        }

        switch (type.toLowerCase()) {
            case "bedroom":
                return defaultBedroomImage;
            case "kitchen":
                return defaultKitchenImage;
            case "living room":
                return defaultLivingRoomImage;
            default:
                return defaultHouseImage;
        }
    };

    // Atualizar a imagem do card no backend
    const handleChangeImage = async (roomId) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const endpoint =
                    roomId === "house"
                        ? `${import.meta.env.VITE_API_URL}/houses/${houseId}/updateImage`
                        : `${import.meta.env.VITE_API_URL}/rooms/${roomId}/updateImage`;

                const response = await fetch(endpoint, {
                    method: "PUT",
                    body: formData,
                });

                if (response.ok) {
                    const updatedItem = await response.json();
                    setCards((prevCards) =>
                        prevCards.map((card) =>
                            card.id === roomId
                                ? { ...card, image: updatedItem.imageUrl }
                                : card
                        )
                    );
                } else {
                    console.error("Failed to update image.");
                }
            } catch (error) {
                console.error("Error updating image:", error);
            }
        };

        fileInput.click();
    };

    // Alternar estado do dropdown
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Funções para navegar nos cards
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
                        Temperature: {cards[currentIndex].temperature}°C
                    </div>
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        Humidity: {cards[currentIndex].humidity}%
                    </div>
                </div>

                {/* Ícone de configurações no canto superior direito */}
                <div className="absolute top-4 right-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
                        >
                            <span className="text-gray-700 text-lg">⚙️</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleChangeImage(cards[currentIndex].id);
                                        }}
                                    >
                                        Change Image
                                    </li>
                                </ul>
                            </div>
                        )}
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
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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
