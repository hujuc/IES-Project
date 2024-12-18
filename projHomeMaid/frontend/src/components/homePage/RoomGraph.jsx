import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip, Legend);

const capitalizeWords = (str) => {
    return str
        .split(/(?=[A-Z])|[_\s]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const RoomGraph = ({ houseId }) => {
    const [timeframe, setTimeframe] = useState("daily");
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [graphData, setGraphData] = useState({ temperatures: [], humidities: [] });
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);

    const customOrder = [
        "hall", "livingRoom", "kitchen",
        "masterBedroom", "guestBedroom", "bathroom", "office", "laundry",
    ];

    useEffect(() => {
        const fetchRooms = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/houses/${houseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    const sortedRooms = data.rooms.sort((a, b) => {
                        const aIndex = customOrder.indexOf(a.type);
                        const bIndex = customOrder.indexOf(b.type);
                        return aIndex - bIndex;
                    });

                    setRooms(sortedRooms);
                    setSelectedRoomId(sortedRooms[0]?.roomId || null);
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                } else {
                    console.error("Failed to fetch rooms");
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, [houseId]);

    useEffect(() => {
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

                if (roomId === selectedRoomId) {
                    setGraphData((prevData) => {
                        const updatedGraphData = { ...prevData };

                        if (field === 'temperature') {
                            updatedGraphData.temperatures.push({
                                x: new Date(), // Set current time
                                y: parseFloat(value).toFixed(2),
                            });
                        } else if (field === 'humidity') {
                            updatedGraphData.humidities.push({
                                x: new Date(), // Set current time
                                y: parseFloat(value).toFixed(2),
                            });
                        }

                        return updatedGraphData;
                    });
                }
            });
        };

        socketClient.activate();
        setClient(socketClient);

        return () => socketClient.deactivate();
    }, [selectedRoomId]);

    useEffect(() => {
        const fetchGraphData = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            if (!selectedRoomId) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/sensors/rooms/${selectedRoomId}/data?timeframe=${timeframe}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    const temperatures = data.map((point) => ({
                        x: new Date(point.time),
                        y: point.temperature,
                    }));

                    const humidities = data.map((point) => ({
                        x: new Date(point.time),
                        y: point.humidity,
                    }));

                    setGraphData({ temperatures, humidities });
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                } else {
                    console.error("Failed to fetch graph data");
                    setGraphData({ temperatures: [], humidities: [] });
                }
            } catch (error) {
                console.error("Error fetching graph data:", error);
                setGraphData({ temperatures: [], humidities: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, [selectedRoomId, timeframe]);

    const chartData = {
        datasets: [
            {
                label: "Temperature (°C)",
                data: graphData.temperatures,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                tension: 0.2,
                pointRadius: 3,
            },
            {
                label: "Humidity (%)",
                data: graphData.humidities,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.2,
                pointRadius: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time",
                time: {
                    unit: timeframe === "daily" ? "hour" : "day",
                },
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Value",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Home Analysis Graph</h3>

            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Select Timeframe:</label>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full sm:w-auto bg-gray-100 text-gray-700 text-sm p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="daily">Last 1 Day</option>
                        <option value="weekly">Last 7 Days</option>
                        <option value="monthly">Last 30 Days</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Select Room:</label>
                    <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full sm:w-auto bg-gray-100 text-gray-700 text-sm p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400"
                    >
                        {rooms.map((room) => (
                            <option key={room.roomId} value={room.roomId}>
                                {capitalizeWords(room.type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ height: "400px" }}>
                {graphData.temperatures.length > 0 || graphData.humidities.length > 0 ? (
                    <Line
                        key={`${selectedRoomId}-${timeframe}`}
                        data={chartData}
                        options={chartOptions}
                    />
                ) : (
                    <div className="text-gray-500 text-center mt-16">
                        No data available for the selected room and timeframe.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomGraph;
