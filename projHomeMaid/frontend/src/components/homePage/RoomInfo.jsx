import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import axios from "axios";

// Importing images for devices
import airConditioner from "../../assets/homePage/devicesImages/airConditioner.jpg";
import coffeMachine from "../../assets/homePage/devicesImages/coffeeMachine.jpg";
import heatedFloor from "../../assets/homePage/devicesImages/heatedFloor.jpg";
import lamp from "../../assets/homePage/devicesImages/lamp.jpg";
import shutters from "../../assets/homePage/devicesImages/shutter.jpg";
import speaker from "../../assets/homePage/devicesImages/stereo.png";
import television from "../../assets/homePage/devicesImages/television.jpg";
import washer from "../../assets/homePage/devicesImages/washingMachine.jpg";
import dryer from "../../assets/homePage/devicesImages/dryerMachine.jpg"
import clock from "../../assets/homePage/devicesImages/clock.jpg"

function RoomInfo({ room }) {
    const [deviceObjects, setDeviceObjects] = useState([]); // Initializing as an empty array
    const [loadingDeviceId, setLoadingDeviceId] = useState(null); // State to manage loading for devices
    const [filter, setFilter] = useState("all"); // Device filter (all, on, off)
    const navigate = useNavigate(); // Initialize useNavigate

    // useEffect to synchronize initial state with received data
    useEffect(() => {
        if (room && room.deviceObjects && room.deviceObjects.length > 0) {
            setDeviceObjects(room.deviceObjects); // Initialize deviceObjects with data from the room prop
        } else {
            setDeviceObjects([]); // Reset to an empty array if the room has no devices
        }
    }, [room]); // Updates local state whenever `room` changes

    // Reset the filter to "all" whenever the room changes
    useEffect(() => {
        setFilter("all"); // Resetting the filter to "all" whenever the room changes
    }, [room]);

    // Function to get the corresponding image for a device type
    const getDeviceImage = (type) => {
        switch (type) {
            case "airConditioner":
                return airConditioner;
            case "coffeeMachine":
                return coffeMachine;
            case "heatedFloor":
                return heatedFloor;
            case "lamp":
                return lamp;
            case "shutter":
                return shutters;
            case "stereo":
                return speaker;
            case "television":
                return television;
            case "washingMachine":
                return washer;
            case "dryerMachine":
                return dryer;
            case "clock":
                return clock;
            default:
                return null;
        }
    };

    // Function to toggle a device's state
    const toggleDeviceState = async (deviceId, currentState) => {
        setLoadingDeviceId(deviceId); // Start loading for the specific device
        const updatedState = !currentState; // Toggle the state (On to Off and vice versa)

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                { state: updatedState }
            );

            if (response.status === 200) {
                // Update local state to reflect the change automatically
                setDeviceObjects((prevDeviceObjects) =>
                    prevDeviceObjects.map((device) =>
                        device.deviceId === deviceId
                            ? { ...device, state: updatedState }
                            : device
                    )
                );
            } else {
                console.error("Error updating the device");
            }
        } catch (error) {
            console.error("Network or other error:", error);
        } finally {
            setLoadingDeviceId(null); // End loading for the specific device
        }
    };

    // Filter devices based on the filter state
    const filteredDevices = deviceObjects.filter((device) => {
        if (filter === "on") return device.state === true;
        if (filter === "off") return device.state === false;
        return true; // "all"
    });

    // Function to render the devices in the room
    const renderDevices = () => {
        if (!filteredDevices || filteredDevices.length === 0) {
            return <p className="text-gray-600"></p>;
        }

        return (
            <div className="grid grid-cols-2 gap-6">
                {filteredDevices.map((device) => (
                    <div
                        key={device.deviceId}
                        className="bg-white rounded-lg shadow-lg p-4 space-y-4 flex flex-col items-center transition-all duration-300 hover:shadow-xl cursor-pointer"
                        onClick={() => navigate(`/${device.type}/${device.deviceId}`)} // Navigate to the automations page
                    >
                        {/* Device Name */}
                        <div className="flex justify-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-800 text-center">{device.name || "Unnamed Device"}</h4>
                        </div>

                        {/* Device Image */}
                        <img
                            src={getDeviceImage(device.type)}
                            alt={device.name || "Device"}
                            className="w-28 h-28 object-cover rounded-full mb-4 border-2 border-gray-200 mx-auto" // Ajustado para w-28 e h-28
                        />

                        {/* Toggle Switch */}
                        <div className="flex items-center space-x-2">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation on toggle click
                                    toggleDeviceState(device.deviceId, device.state);
                                }}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                    device.state ? "bg-orange-500" : "bg-gray-300"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                        device.state ? "translate-x-6" : "translate-x-0"
                                    }`}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#D9D9D9] rounded-[22px] w-full overflow-y-auto p-6 mt-6">
            {/* Display the filter dropdown only if there are devices */}
            {deviceObjects.length > 0 && (
                <div className="flex justify-start mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:ring-orange-500"
                    >
                        <option value="all">All</option>
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>
                </div>
            )}

            {renderDevices()}
        </div>
    );
}

export default RoomInfo;
