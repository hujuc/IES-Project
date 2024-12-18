import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeviceCard from "./DeviceCard";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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
        const socket = new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "/ws/devices")}`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/device-updates", (message) => {
                    const updatedDevice = JSON.parse(message.body);

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

            const updatedState = {
                state: !currentState,
                ...updatedDeviceData,
            };

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                updatedState,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDeviceObjects((prevDevices) =>
                prevDevices.map((device) =>
                    device.deviceId === deviceId
                        ? { ...device, ...updatedState }
                        : device
                )
            );

            if (["washingMachine", "dryerMachine", "coffeeMachine"].includes(deviceType) && updatedState.state) {
                const cycleTime = deviceType === "coffeeMachine" ? 30000 : 120000;

                setTimeout(async () => {
                    try {
                        const finalState = { state: false };

                        await axios.patch(
                            `${import.meta.env.VITE_API_URL}/devices/${deviceId}`,
                            finalState,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        setDeviceObjects((prevDevices) =>
                            prevDevices.map((device) =>
                                device.deviceId === deviceId
                                    ? { ...device, ...finalState }
                                    : device
                            )
                        );

                        if (stompClientRef.current && stompClientRef.current.connected) {
                            const deviceJson = JSON.stringify({
                                deviceId: deviceId,
                                state: false,
                            });

                            stompClientRef.current.publish({
                                destination: "/topic/device-updates",
                                body: deviceJson,
                            });
                        }
                    } catch (error) {
                        console.error(`Erro ao finalizar ciclo de ${deviceType}:`, error);
                    }
                }, cycleTime); 
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
