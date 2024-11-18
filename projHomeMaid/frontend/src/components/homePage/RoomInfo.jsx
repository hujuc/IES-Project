import React from "react";

function RoomInfo({ room }) {
    // Dynamically render content based on the room
    const renderRoomContent = () => {
        switch (room.label) {
            case "Home":
                return (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Home Details</h2>
                        <p className="text-gray-600">This is your primary residence.</p>
                        <p className="text-gray-600">Temperature: {room.temperature}</p>
                        <p className="text-gray-600">Energy Usage: {room.energy}</p>
                        <p className="text-gray-600 mt-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                            venenatis, libero at ultricies vulputate, felis turpis lacinia
                            ipsum, nec bibendum felis nulla nec nunc. Aenean facilisis dapibus
                            tincidunt.
                        </p>
                    </div>
                );
            case "Vacation Home":
                return (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Vacation Home Details</h2>
                        <p className="text-gray-600">This is your secondary residence.</p>
                        <p className="text-gray-600">Temperature: {room.temperature}</p>
                        <p className="text-gray-600">Energy Usage: {room.energy}</p>
                    </div>
                );
            case "Office":
                return (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Office Details</h2>
                        <p className="text-gray-600">This is your workspace.</p>
                        <p className="text-gray-600">Temperature: {room.temperature}</p>
                        <p className="text-gray-600">Energy Usage: {room.energy}</p>
                    </div>
                );
            default:
                return <p className="text-gray-600">No details available.</p>;
        }
    };

    return (
        <div
            className="bg-[#D9D9D9] rounded-[22px] w-full overflow-y-auto p-6 mt-6"
            style={{ height: "calc(100vh - 450px)" }} // Dynamic height from the slider
        >
            {renderRoomContent()}
        </div>
    );
}

export default RoomInfo;
