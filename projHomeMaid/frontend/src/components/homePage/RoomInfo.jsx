import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeviceCard from "./DeviceCard";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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
    const stompClientRef = useRef(null);
    const workerRef = useRef(null);

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

    useEffect(() => {
        // Setup WebSocket for real-time updates
        const socket = new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")}`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket for device updates.");

                client.subscribe("/topic/device-updates", (message) => {
                    const updatedDevice = JSON.parse(message.body);
                    console.log("Received device update:", updatedDevice);

                    setDeviceObjects((prevDevices) =>
                        prevDevices.map((device) =>
                            device.deviceId === updatedDevice.deviceId
                                ? { ...device, state: updatedDevice.state }
                                : device
                        )
                    );
                });
            },
            onStompError: (frame) => {
                console.error("WebSocket error:", frame);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log("WebSocket disconnected.");
            }
        };
    }, []);

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

    const toggleDeviceState = async (deviceId, currentState, deviceType, updatedDeviceData = {}) => {
        setLoadingDeviceId(deviceId);

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            // Cria o novo estado inicial do dispositivo
            const updatedState = {
                state: !currentState,
                ...updatedDeviceData,
            };

            // Atualiza o estado no servidor (PATCH)
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                updatedState,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Atualiza o estado local para refletir o novo estado
            setDeviceObjects((prevDevices) =>
                prevDevices.map((device) =>
                    device.deviceId === deviceId
                        ? { ...device, ...updatedState }
                        : device
                )
            );

            // Simula o ciclo para dispositivos específicos (ex.: coffeeMachine, dryerMachine, washingMachine)
            if (["washingMachine", "dryerMachine", "coffeeMachine"].includes(deviceType) && updatedState.state) {
                const cycleTime = deviceType === "coffeeMachine" ? 30000 : 120000; // 30s para coffeeMachine, 2min para outros

                console.log(`Iniciando ciclo para ${deviceType}...`);

                setTimeout(async () => {
                    try {
                        console.log(`Ciclo para ${deviceType} concluído. Atualizando estado para false...`);

                        // Novo estado ao final do ciclo
                        const finalState = { state: false };

                        // Atualiza o servidor com o estado final (PATCH)
                        await axios.patch(
                            `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                            finalState,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // Atualiza o estado local para refletir o fim do ciclo
                        setDeviceObjects((prevDevices) =>
                            prevDevices.map((device) =>
                                device.deviceId === deviceId
                                    ? { ...device, ...finalState }
                                    : device
                            )
                        );

                        // Publica a atualização no WebSocket para o tópico "/topic/device-updates"
                        if (stompClientRef.current && stompClientRef.current.connected) {
                            const deviceJson = JSON.stringify({
                                deviceId: deviceId,
                                state: false,
                            });

                            stompClientRef.current.publish({
                                destination: "/topic/device-updates",
                                body: deviceJson,
                            });

                            console.log(`${deviceType} ciclo concluído. Mensagem enviada via WebSocket: ${deviceJson}`);
                        }
                    } catch (error) {
                        console.error(`Erro ao finalizar ciclo de ${deviceType}:`, error);
                    }
                }, cycleTime); // Tempo do ciclo (30s ou 120s)
            }
        } catch (error) {
            console.error("Error updating device state:", error);
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
