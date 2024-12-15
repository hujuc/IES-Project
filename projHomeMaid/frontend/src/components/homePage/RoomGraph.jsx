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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip, Legend);

// Função para capitalizar a primeira letra de cada palavra
const capitalizeWords = (str) => {
    return str
        .split(/(?=[A-Z])|[_\s]/) // Divide por camelCase, underscores ou espaços
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const RoomGraph = ({ houseId }) => {
    const [timeframe, setTimeframe] = useState("daily");
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Buscar os quartos da casa
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/houses/${houseId}`);
                if (response.ok) {
                    const data = await response.json();
                    setRooms(data.rooms || []);
                    setSelectedRoomId(data.rooms[0]?.roomId || null); // Seleciona o primeiro quarto por padrão
                } else {
                    console.error("Failed to fetch rooms");
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, [houseId]);

    // Buscar os dados para o gráfico
    useEffect(() => {
        const fetchGraphData = async () => {
            if (!selectedRoomId) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/sensors/rooms/${selectedRoomId}/data?timeframe=${timeframe}`
                );
                if (response.ok) {
                    const data = await response.json();

                    // Prepara os dados para o gráfico
                    const temperatures = data.map((point) => ({
                        x: new Date(point.time), // Certifique-se de que o formato é válido
                        y: point.temperature,
                    }));

                    const humidities = data.map((point) => ({
                        x: new Date(point.time), // Certifique-se de que o formato é válido
                        y: point.humidity,
                    }));

                    console.log("Graph data fetched:", { temperatures, humidities });

                    setGraphData({ temperatures, humidities });
                } else {
                    console.error("Failed to fetch graph data");
                    setGraphData(null);
                }
            } catch (error) {
                console.error("Error fetching graph data:", error);
                setGraphData(null);
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
                data: graphData?.temperatures || [],
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                tension: 0.2,
                pointRadius: 3,
            },
            {
                label: "Humidity (%)",
                data: graphData?.humidities || [],
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
                    unit: timeframe === "daily" ? "hour" : "day", // Ajusta a granularidade conforme o timeframe
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


            {/* Controles de Filtros */}
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
                                {capitalizeWords(room.type)} {/* Capitaliza o nome do quarto */}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Renderiza o gráfico ou mensagem de dados indisponíveis */}
            <div style={{ height: "400px" }}>
                {graphData?.temperatures?.length > 0 || graphData?.humidities?.length > 0 ? (
                    <Line
                        key={`${selectedRoomId}-${timeframe}`} // Força o re-render quando o roomId ou timeframe mudam
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
