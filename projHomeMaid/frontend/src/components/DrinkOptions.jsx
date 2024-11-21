import React, { useState } from "react";

export default function DrinkOptions() {
    const [selectedOption, setSelectedOption] = useState("Espresso"); // Predefined option: Espresso

    const options = [
        { name: "Espresso", icon: "☕" },
        { name: "Tea", icon: "🍵" },
        { name: "Latte", icon: "🥛" },
    ];

    const handleSelection = (optionName) => {
        setSelectedOption(optionName); // Update selected option
    };

    return (
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
    );
}
