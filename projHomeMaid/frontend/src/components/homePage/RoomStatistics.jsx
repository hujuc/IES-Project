import React, { useState, useEffect } from "react";

// Função para capitalizar a primeira letra de cada palavra
const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const RoomStatistics = ({ houseId }) => {
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedRoomStats, setSelectedRoomStats] = useState({ temperature: "N/A", humidity: "N/A" });
    const [rooms, setRooms] = useState([]);
    const [timeframe, setTimeframe] = useState("daily");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);

            try {
                const houseDataResponse = await fetch(`${import.meta.env.VITE_API_URL}/houses/${houseId}`);
                const houseData = await houseDataResponse.json();

                setRooms(houseData.rooms);
                setSelectedRoomId(houseData.rooms[0]?.roomId || null); // Selecionar o primeiro quarto como padrão
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError("Failed to load rooms. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [houseId]);

    useEffect(() => {
        const fetchRoomStatistics = async () => {
            if (!selectedRoomId) return;

            try {
                const roomTemperatureEndpoint = `${import.meta.env.VITE_API_URL}/sensors/rooms/${selectedRoomId}/average-temperature?timeframe=${timeframe}`;
                const roomHumidityEndpoint = `${import.meta.env.VITE_API_URL}/sensors/rooms/${selectedRoomId}/average-humidity?timeframe=${timeframe}`;

                const [roomTemperatureResponse, roomHumidityResponse] = await Promise.all([
                    fetch(roomTemperatureEndpoint),
                    fetch(roomHumidityEndpoint),
                ]);

                const roomTemperatureData = await roomTemperatureResponse.text();
                const roomHumidityData = await roomHumidityResponse.text();

                const roomTemperature = parseFloat(roomTemperatureData.match(/[-+]?[0-9]*\.?[0-9]+/)) || "N/A";
                const roomHumidity = parseFloat(roomHumidityData.match(/[-+]?[0-9]*\.?[0-9]+/)) || "N/A";

                setSelectedRoomStats({ temperature: roomTemperature, humidity: roomHumidity });
            } catch (error) {
                console.error("Error fetching room statistics:", error);
                setSelectedRoomStats({ temperature: "N/A", humidity: "N/A" });
            }
        };

        fetchRoomStatistics();
    }, [selectedRoomId, timeframe]);

    if (loading) {
        return <div className="text-gray-500">Loading statistics...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-6 mt-6">
            {/* Título da Seção */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Home Analysis</h3>

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

            {/* Estatísticas do Quarto Selecionado */}
            {selectedRoomId && (
                <div className="bg-gray-50 p-6 rounded-lg text-center shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Room Statistics</h4>
                    <p className="text-4xl font-bold text-gray-800 mb-2">
                        {selectedRoomStats.temperature !== "N/A"
                            ? `${selectedRoomStats.temperature}°C`
                            : "N/A"}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">Average Temperature</p>
                    <p className="text-4xl font-bold text-gray-800 mb-2">
                        {selectedRoomStats.humidity !== "N/A"
                            ? `${selectedRoomStats.humidity}%`
                            : "N/A"}
                    </p>
                    <p className="text-lg text-gray-600">Average Humidity</p>
                </div>

            )}
        </div>


);
};

export default RoomStatistics;
