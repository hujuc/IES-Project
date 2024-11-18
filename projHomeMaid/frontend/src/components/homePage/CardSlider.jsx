import React, { useState } from "react";
import RoomInfo from "./RoomInfo"; // Import RoomInfo component
import { IoMdSettings } from "react-icons/io"; // Import settings icon

function CardSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

    const cards = [
        {
            id: 1,
            image: "https://via.placeholder.com/300x150", // Replace with real image
            temperature: "23° Celsius",
            energy: "320 KWh",
            label: "Home",
        },
        {
            id: 2,
            image: "https://via.placeholder.com/300x150", // Replace with real image
            temperature: "25° Celsius",
            energy: "400 KWh",
            label: "Vacation Home",
        },
        {
            id: 3,
            image: "https://via.placeholder.com/300x150", // Replace with real image
            temperature: "20° Celsius",
            energy: "280 KWh",
            label: "Office",
        },
    ];

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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleChangeImage = () => {
        alert("Change Image option clicked for " + cards[currentIndex].label);
        setDropdownOpen(false); // Close the dropdown
    };

    return (
        <div className="relative flex flex-col items-center space-y-4">
            {/* Card Display */}
            <div className="relative bg-gray-100 rounded-xl shadow-md w-96 h-64">
                {/* Image */}
                <img
                    src={cards[currentIndex].image}
                    alt={cards[currentIndex].label}
                    className="w-full h-full object-cover rounded-lg p-2"
                />

                {/* Temperature and Energy Info */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <div className="bg-white text-gray-700 px-3 py-1 rounded-full shadow">
                        {cards[currentIndex].temperature}
                    </div>
                    <div className="bg-white text-gray-700 px-3 py-1 rounded-full shadow">
                        {cards[currentIndex].energy}
                    </div>
                </div>

                {/* Label */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white text-xl font-semibold bg-black bg-opacity-50 py-1 rounded-md">
                        {cards[currentIndex].label}
                    </p>
                </div>

                {/* Settings Icon */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleDropdown}
                        className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 shadow"
                    >
                        <IoMdSettings className="text-gray-700 w-6 h-6" />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md">
                            <ul className="py-2">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleChangeImage}
                                >
                                    Change Image
                                </li>
                            </ul>
                        </div>
                    )}
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
