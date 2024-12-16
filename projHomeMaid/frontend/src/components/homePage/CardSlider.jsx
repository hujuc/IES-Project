import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomInfo from "./RoomInfo";

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
    const [cards, setCards] = useState([]); // Store card data
    const [currentIndex, setCurrentIndex] = useState(0); // Current slider index
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(""); // For error handling
    const navigate = useNavigate();

    // Map room types to custom names
    const roomNames = {
        "masterBedroom": "Master Bedroom",
        "guestBedroom": "Guest Bedroom",
        "kitchen": "Kitchen",
        "livingRoom": "Living Room",
        "hall": "Hall",
        "laundry": "Laundry",
        "office": "Office",
        "bathroom": "Bathroom",
        "house": "House", // Could also use the house name here.
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
        "laundry"
    ];

    // UseEffect to fetch house and room data from backend
    useEffect(() => {
        const fetchHouseData = async () => {
            const token = localStorage.getItem("jwtToken"); // Get JWT token

            if (!token) {
                // Redirect to login if no token is found
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/houses/${houseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include JWT in Authorization header
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    const houseCard = {
                        id: "house", // ID for the house
                        label: roomNames["house"], // Use the mapped name for the house
                        image: HouseImage,
                        type: "House",
                        deviceObjects: data.devices,
                    }
                    const roomCards = data.rooms.map((room) => ({
                        id: room.type, // Ensure `type` is in the custom order
                        label: roomNames[room.type] || room.type, // Custom name or fallback to type
                        image: getDefaultImage(room.type), // Get default image for room type
                        type: room.type,
                        deviceObjects: room.deviceObjects,
                    }));

                    // Sort cards based on custom order
                    const orderedCards = [houseCard, ...roomCards].sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.id);
                        const bIndex = customOrder.indexOf(b.id);

                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;

                        return aIndex - bIndex;
                    });

                    setCards(orderedCards);
                } else if (response.status === 401) {
                    // Redirect to login if token is invalid or expired
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                } else if(response.status === 403){
                    console.log("Unauthorized Access");
                    navigate("/login")
                }
                else {
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
                return HouseImage; // Default image for the house
        }
    };

    // Slider navigation functions
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

    // Display loading or error message
    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (cards.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div className="relative flex flex-col items-center space-y-4">
            {/* Card Display */}
            <div className="relative bg-gray-100 rounded-xl shadow-md w-96 h-64">
                <img
                    src={cards[currentIndex].image}
                    alt={cards[currentIndex].label}
                    className="w-full h-full object-cover rounded-lg p-2"
                />
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Temperature:</strong> {22}°C
                    </div>
                    <div className="bg-white text-gray-700 px-2 py-1 text-sm rounded-full shadow">
                        <strong>Humidity:</strong> {22}%
                    </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xl font-semibold text-white bg-black bg-opacity-50 py-1 rounded-md">
                        {cards[currentIndex].label}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
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

            {/* Room Info */}
            <RoomInfo room={cards[currentIndex]} />
        </div>
    );
}

export default CardSlider;
