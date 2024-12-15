import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomInfo from "./RoomInfo";
import Statistics from "./RoomStatistics.jsx";
import RoomGraph from "./RoomGraph.jsx";

// Default room images
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
    const { houseId } = useParams(); // Get houseId from URL
    const navigate = useNavigate(); // Navigation
    const [cards, setCards] = useState([]); // Store card data
    const [currentIndex, setCurrentIndex] = useState(0); // Current slider index
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(""); // For error handling

    // Map room types to custom names
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

    // Custom order of cards
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

    // Get the default image for a room type
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

    // Fetch the latest temperature and humidity for a room
    const fetchLatestValues = async (roomId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/sensors/rooms/${roomId}/latest`);
            if (response.ok) {
                const data = await response.json();
                return {
                    temperature: data.temperature ?? "N/A",
                    humidity: data.humidity ?? "N/A",
                };
            } else {
                console.error("Failed to fetch latest values for room:", roomId);
                return { temperature: "N/A", humidity: "N/A" };
            }
        } catch (error) {
            console.error("Error fetching latest values:", error);
            return { temperature: "N/A", humidity: "N/A" };
        }
    };

    // Fetch house data and populate cards
    useEffect(() => {
        const fetchHouseData = async () => {
            setLoading(true);
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                navigate("/login"); // Redirect if no token
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/houses/${houseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    const houseCard = {
                        id: "house",
                        label: roomNames["house"],
                        image: HouseImage,
                        type: "House",
                        deviceObjects: data.devices,
                        temperature: "N/A",
                        humidity: "N/A",
                    };

                    const roomCards = await Promise.all(
                        data.rooms.map(async (room) => {
                            const latestValues = await fetchLatestValues(room.roomId);
                            return {
                                id: room.roomId,
                                label: roomNames[room.type] || room.type,
                                image: getDefaultImage(room.type),
                                type: room.type,
                                deviceObjects: room.deviceObjects,
                                temperature: latestValues.temperature,
                                humidity: latestValues.humidity,
                            };
                        })
                    );

                    const orderedCards = [houseCard, ...roomCards].sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.type);
                        const bIndex = customOrder.indexOf(b.type);
                        return aIndex - bIndex;
                    });

                    setCards(orderedCards);
                } else if (response.status === 401) {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                } else {
                    console.error("Failed to fetch house data");
                    setErrorMessage("Failed to fetch house data.");
                }
            } catch (error) {
                console.error("Error fetching house data:", error);
                setErrorMessage("An error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHouseData();
    }, [houseId, navigate]);

    // Slider navigation
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (cards.length === 0) {
        return <div>No data available</div>;
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="relative flex flex-col items-center space-y-4">
            <div className="relative bg-gray-100 rounded-xl shadow-md w-96 h-64">
                <img
                    src={currentCard.image}
                    alt={currentCard.label}
                    className="w-full h-full object-cover rounded-lg p-2"
                />
                {currentCard.id !== "house" && (
                    <div className="absolute top-4 left-4 bg-white text-gray-700 px-2 py-1 text-sm rounded-lg shadow">
                        <p>
                            <strong>Temperature:</strong> {currentCard.temperature}°C
                        </p>
                        <p>
                            <strong>Humidity:</strong> {currentCard.humidity}%
                        </p>
                    </div>
                )}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xl font-semibold text-white bg-black bg-opacity-50 py-1 rounded-md">
                        {currentCard.label}
                    </p>
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Next
                </button>
            </div>

            {currentCard.id !== "house" && <RoomInfo room={currentCard} />}
            {currentCard.id === "house" && (
                <>
                    <Statistics houseId={houseId} />
                    <RoomGraph houseId={houseId} />
                </>
            )}
        </div>
    );
}

export default CardSlider;
