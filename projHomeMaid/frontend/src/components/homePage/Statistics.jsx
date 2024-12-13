import React, { useState, useEffect } from "react";

const Statistics = ({ houseId, rooms }) => {
    const [averageTemperature, setAverageTemperature] = useState(null);
    const [averageHumidity, setAverageHumidity] = useState(null);
    const [timeframe, setTimeframe] = useState("daily");
    const [selectedRoom, setSelectedRoom] = useState("house"); // Default para a casa inteira
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                // Determina os endpoints com base na seleção (casa ou quarto)
                const baseUrl = `${import.meta.env.VITE_API_URL}/sensors`;

                const temperatureEndpoint =
                    selectedRoom === "house"
                        ? `${baseUrl}/houses/${houseId}/average-temperature?timeframe=${timeframe}`
                        : `${baseUrl}/rooms/${selectedRoom}/average-temperature?timeframe=${timeframe}`;

                const humidityEndpoint =
                    selectedRoom === "house"
                        ? `${baseUrl}/houses/${houseId}/average-humidity?timeframe=${timeframe}`
                        : `${baseUrl}/rooms/${selectedRoom}/average-humidity?timeframe=${timeframe}`;

                // Faz chamadas paralelas aos endpoints
                const [temperatureResponse, humidityResponse] = await Promise.all([
                    fetch(temperatureEndpoint),
                    fetch(humidityEndpoint),
                ]);

                // Verifica se as respostas são válidas
                if (!temperatureResponse.ok || !humidityResponse.ok) {
                    throw new Error("Failed to fetch statistics data");
                }

                const temperatureText = await temperatureResponse.text();
                const humidityText = await humidityResponse.text();

                // Extrai os valores numéricos das respostas
                const temperatureValue = parseFloat(
                    temperatureText.match(/[-+]?[0-9]*\.?[0-9]+/)
                );
                const humidityValue = parseFloat(
                    humidityText.match(/[-+]?[0-9]*\.?[0-9]+/)
                );

                setAverageTemperature(isNaN(temperatureValue) ? "N/A" : temperatureValue);
                setAverageHumidity(isNaN(humidityValue) ? "N/A" : humidityValue);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                setAverageTemperature("N/A");
                setAverageHumidity("N/A");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [houseId, selectedRoom, timeframe]);

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Home Analysis</h3>

            {/* Dropdowns para filtros */}
            <div className="flex justify-between space-x-4 mb-6">
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-1/3 bg-gray-100 text-gray-700 p-2 rounded-lg border border-gray-300 focus:outline-none"
                >
                    <option value="daily">Last 1 Day</option>
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">Last 30 Days</option>
                </select>

                <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-1/3 bg-gray-100 text-gray-700 p-2 rounded-lg border border-gray-300 focus:outline-none"
                >
                    <option value="house">House</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estatísticas exibidas */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center shadow-inner">
                    <p className="text-4xl font-bold text-gray-800 mb-2">
                        {averageTemperature !== "N/A" ? `${averageTemperature}°C` : "N/A"}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">Average Temperature</p>
                    <p className="text-4xl font-bold text-gray-800 mb-2">
                        {averageHumidity !== "N/A" ? `${averageHumidity}%` : "N/A"}
                    </p>
                    <p className="text-lg text-gray-600">Average Humidity</p>
                </div>
            )}
        </div>
    );
};

export default Statistics;
