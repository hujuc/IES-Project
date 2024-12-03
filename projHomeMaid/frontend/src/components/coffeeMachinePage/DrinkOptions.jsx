import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you're using Axios for API calls

export default function DrinkOptions({ deviceId }) {
    const [selectedOption, setSelectedOption] = useState("Espresso"); // Default option: Espresso
    const options = [
        { name: "Espresso", icon: "☕" },
        { name: "Tea", icon: "🍵" },
        { name: "Latte", icon: "🥛" },
    ];
    const [error, setError] = useState(null);

    // Fetch the initial drinkType from the database
    useEffect(() => {
        const fetchDrinkType = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/devices/${deviceId}`);
                const { drinkType } = response.data; // Assuming the database has a 'drinkType' field
                setSelectedOption(drinkType || "Espresso"); // Default to "Espresso" if null
            } catch (err) {
                console.error("Error fetching drink type:", err);
                setError("Failed to fetch the current drink type.");
            }
        };

        if (deviceId) {
            fetchDrinkType();
        }
    }, [deviceId]);

    // Update the drinkType in the database
    const updateDrinkType = async (optionName) => {
        try {
            await axios.patch(`http://localhost:8080/api/devices/${deviceId}`, {
                drinkType: optionName,
            });
            console.log("Drink type updated successfully");
        } catch (err) {
            console.error("Error updating drink type:", err);
            setError("Failed to update the selected drink type.");
        }
    };

    // Handle user selection
    const handleSelection = (optionName) => {
        setSelectedOption(optionName); // Update the local state
        updateDrinkType(optionName); // Update the database
    };

    return (
        <div className="flex flex-col items-center">
            {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}
            <div className="flex space-x-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelection(option.name)}
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg shadow-md focus:outline-none ${
                            selectedOption === option.name
                                ? "bg-orange-500 text-white"
                                : "bg-white text-gray-800"
                        }`}
                    >
                        <span className="text-3xl">{option.icon}</span>
                        <span className="text-sm font-medium">{option.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
