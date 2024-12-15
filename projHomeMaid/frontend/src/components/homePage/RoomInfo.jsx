import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeviceCard from "./DeviceCard";

// Importing images for devices
import airConditioner from "../../assets/homePage/devicesImages/airConditioner.jpg";
import coffeMachine from "../../assets/homePage/devicesImages/coffeeMachine.jpg";
import heatedFloor from "../../assets/homePage/devicesImages/heatedFloor.jpg";
import lamp from "../../assets/homePage/devicesImages/lamp.jpg";
import shutters from "../../assets/homePage/devicesImages/shutter.jpg";
import speaker from "../../assets/homePage/devicesImages/stereo.png";
import television from "../../assets/homePage/devicesImages/television.jpg";
import washer from "../../assets/homePage/devicesImages/washingMachine.jpg";
import dryer from "../../assets/homePage/devicesImages/dryerMachine.jpg";
import clock from "../../assets/homePage/devicesImages/clock.jpg";

function RoomInfo({ room }) {
    const [deviceObjects, setDeviceObjects] = useState([]);
    const [loadingDeviceId, setLoadingDeviceId] = useState(null);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        if (room && room.deviceObjects && room.deviceObjects.length > 0) {
            setDeviceObjects(room.deviceObjects);
        } else {
            setDeviceObjects([]);
        }
    }, [room]);

    useEffect(() => {
        setFilter("all");
    }, [room]);

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

    const toggleDeviceState = async (deviceId, currentState, deviceType) => {
        setLoadingDeviceId(deviceId);

        let updatedState = !currentState;

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            // Regras específicas para washingMachine, dryerMachine e coffeeMachine
            if (
                (deviceType === "washingMachine" ||
                    deviceType === "dryerMachine" ||
                    deviceType === "coffeeMachine") &&
                currentState === false
            ) {
                // Permitir mudar de false para true e iniciar o "ciclo"
                updatedState = true;

                await axios.patch(
                    `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                    { state: updatedState },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Atualiza o estado local para mostrar como "ligado"
                setDeviceObjects((prevDeviceObjects) =>
                    prevDeviceObjects.map((device) =>
                        device.deviceId === deviceId
                            ? { ...device, state: updatedState }
                            : device
                    )
                );

                // Simular o ciclo e voltar a desligar após o tempo definido
                const simulationTime =
                    deviceType === "coffeeMachine" ? 30000 : 120000; // 30s para café, 2min para máquinas

                setTimeout(async () => {
                    try {
                        await axios.patch(
                            `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                            { state: false }, // Voltar para desligado
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        // Atualiza o estado local para desligado
                        setDeviceObjects((prevDeviceObjects) =>
                            prevDeviceObjects.map((device) =>
                                device.deviceId === deviceId
                                    ? { ...device, state: false }
                                    : device
                            )
                        );
                    } catch (error) {
                        console.error(
                            `Error resetting the state for ${deviceType}:`,
                            error
                        );
                    }
                }, simulationTime);

                setLoadingDeviceId(null);
                return;
            }

            // Regras específicas para os outros dispositivos
            if (deviceType === "clock" && !currentState) {
                console.warn("Cannot turn on the clock.");
                setLoadingDeviceId(null);
                return;
            } else if (
                (deviceType === "washingMachine" ||
                    deviceType === "dryerMachine" ||
                    deviceType === "coffeeMachine") &&
                currentState === true
            ) {
                console.warn(`Cannot turn off the ${deviceType}.`);
                setLoadingDeviceId(null);
                return;
            }

            // Comportamento padrão: alternar estado
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                { state: updatedState },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Atualiza o estado local
            setDeviceObjects((prevDeviceObjects) =>
                prevDeviceObjects.map((device) =>
                    device.deviceId === deviceId
                        ? { ...device, state: updatedState }
                        : device
                )
            );
        } catch (error) {
            console.error("Network or other error:", error);
        } finally {
            setLoadingDeviceId(null);
        }
    };

    const filteredDevices = deviceObjects.filter((device) => {
        if (filter === "on") return device.state === true;
        if (filter === "off") return device.state === false;
        return true;
    });

    return (
        <div className="bg-[#D9D9D9] rounded-[22px] w-full overflow-y-auto p-6 mt-6">
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

            <div className="grid grid-cols-2 gap-6">
                {filteredDevices.map((device) => (
                    <DeviceCard
                        key={device.deviceId}
                        device={device}
                        onToggle={toggleDeviceState}
                        getDeviceImage={getDeviceImage}
                        loadingDeviceId={loadingDeviceId}
                    />
                ))}
            </div>
        </div>
    );
}

export default RoomInfo;
