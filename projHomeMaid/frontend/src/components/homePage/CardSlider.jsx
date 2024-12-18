import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import RoomInfo from "./RoomInfo";
import Statistics from "./RoomStatistics.jsx";
import RoomGraph from "./RoomGraph.jsx";
import AddDeviceModal from "./AddDeviceModal.jsx";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
    const { houseId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceData, setDeviceData] = useState({ name: "", type: "", room: "" });

    const [client, setClient] = useState(null);
    const [sensorData, setSensorData] = useState({ temperature: "N/A", humidity: "N/A" });

    const deviceTypes = [
        "airConditioner", "coffeeMachine", "heatedFloor", "lamp", "shutter",
        "stereo", "television", "washingMachine", "dryerMachine", "clock",
    ];

    const rooms = [
        "hall", "masterBedroom", "guestBedroom", "kitchen",
        "livingRoom", "bathroom", "office", "laundry",
    ];

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

    const customOrder = [
        "house", "hall", "livingRoom", "kitchen",
        "masterBedroom", "guestBedroom", "bathroom", "office", "laundry",
    ];

    const getDefaultImage = (type) => {
        switch (type) {
            case "masterBedroom": return BedroomImage;
            case "guestBedroom": return GuestBedroomImage;
            case "kitchen": return KitchenImage;
            case "livingRoom": return LivingRoomImage;
            case "hall": return HallImage;
            case "laundry": return LaundryImage;
            case "office": return OfficeImage;
            case "bathroom": return BathroomImage;
            default: return HouseImage;
        }
    };

    const fetchLatestValues = async (roomId) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return { temperature: "N/A", humidity: "N/A" };
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/sensors/rooms/${roomId}/latest`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("jwtToken");
                navigate("/login");
                return { temperature: "N/A", humidity: "N/A" };
            }

            if (response.ok) {
                const data = await response.json();
                return {
                    temperature: data.temperature ? parseFloat(data.temperature).toFixed(2) : "N/A",
                    humidity: data.humidity ? parseFloat(data.humidity).toFixed(2) : "N/A",
                };
            }

            console.error(`Failed to fetch latest values for room ${roomId}:`, response.status);
            return { temperature: "N/A", humidity: "N/A" };
        } catch (error) {
            console.error("Error fetching latest values:", error);
            return { temperature: "N/A", humidity: "N/A" };
        }
    };

    useEffect(() => {
        const fetchHouseData = async () => {
            setLoading(true);
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/houses/${houseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
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

                    const roomCards = await Promise.all(data.rooms.map(async (room) => {
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
                    }));

                    const orderedCards = [houseCard, ...roomCards].sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.type);
                        const bIndex = customOrder.indexOf(b.type);
                        return aIndex - bIndex;
                    });

                    setCards(orderedCards);
                }
            } catch {
                setErrorMessage("Failed to fetch house data.");
            } finally {
                setLoading(false);
            }
        };

        fetchHouseData();

        const socketClient = new Client({
            webSocketFactory: () =>
                new SockJS(import.meta.env.VITE_API_URL.replace("/api", "/ws/sensors")),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {},
            onStompError: (frame) => {
                console.error("WebSocket connection error:", frame);
            },
        });

        socketClient.onConnect = () => {
            socketClient.subscribe(`/topic/sensor-updates`, (message) => {
                const updatedData = JSON.parse(message.body);

                const { roomId, field, value } = updatedData;

                const roundedValue = parseFloat(value).toFixed(2);

                setCards((prevCards) =>
                    prevCards.map((card) => {
                        if (card.id === roomId) {
                            if (field === 'temperature') {
                                return {
                                    ...card,
                                    temperature: roundedValue,
                                };
                            } else if (field === 'humidity') {
                                return {
                                    ...card,
                                    humidity: roundedValue,
                                };
                            }
                        }
                        return card;
                    })
                );
            });
        };

        socketClient.activate();
        setClient(socketClient);

        return () => socketClient.deactivate();
    }, [houseId, navigate]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
    };

    const handleAddDevice = async (deviceData) => {
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/devices/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    houseId,
                    roomType: deviceData.room || "house",
                    type: deviceData.type,
                    name: deviceData.name,
                }),
            });

            if (response.ok) {
                const newDevice = await response.json();

                const updatedCards = [...cards];
                const targetCardIndex = updatedCards.findIndex(
                    (card) => card.type === (deviceData.room || "house")
                );

                if (targetCardIndex > -1) {
                    if (!updatedCards[targetCardIndex].deviceObjects) {
                        updatedCards[targetCardIndex].deviceObjects = [];
                    }
                    updatedCards[targetCardIndex].deviceObjects.push(newDevice);
                }

                setCards(updatedCards);
                setIsModalOpen(false);
                setErrorMessage("");
            } else {
                console.error("Failed to add device:", response.statusText);
                alert("Failed to add device. Please try again.");
            }
        } catch (error) {
            console.error("Error adding device:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (cards.length === 0) return <div>No data available</div>;

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
                        <p><strong>Temperature:</strong> {currentCard.temperature}°C</p>
                        <p><strong>Humidity:</strong> {currentCard.humidity}%</p>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600"
                    >
                        Add Device
                    </button>
                </div>
                <div
                    className="absolute left-0 right-0 py-1 bg-black bg-opacity-50 text-center"
                    style={{bottom: '5%', borderTopLeftRadius: "0", borderTopRightRadius: "0"}}
                >
                    <p className="text-xl font-semibold text-white">{currentCard.label}</p>
                </div>
            </div>

            <AddDeviceModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                deviceTypes={deviceTypes}
                rooms={rooms}
                roomNames={roomNames}
                currentCard={currentCard}
                onAddDevice={handleAddDevice}
            />

            <div className="flex space-x-4">
                <button onClick={handlePrev}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400">
                    Prev
                </button>
                <button onClick={handleNext}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400">
                    Next
                </button>
            </div>

            {currentCard.deviceObjects && currentCard.deviceObjects.length > 0 && (
                <RoomInfo key={currentCard.deviceObjects?.length} room={currentCard} />
            )}

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
