import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function AutomationBox({ deviceId, children }) {
    const [receiveNotifications, setReceiveNotifications] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch the device's notification preference
        const fetchNotificationPreference = async () => {
            try {
                // Validate that deviceId is provided
                if (!deviceId) {
                    console.error("Device ID is required.");
                    return;
                }

                const token = localStorage.getItem("jwtToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the Authorization header
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.receiveAutomationNotification !== undefined) {
                        setReceiveNotifications(data.receiveAutomationNotification);
                    } else {
                        console.warn("Notification preference not set. Defaulting to true.");
                        setReceiveNotifications(true); // Default value if not set
                    }
                } else if (response.status === 401) {
                    navigate("/login");
                } else {
                    console.error("Failed to fetch notification preference. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching notification preference:", err);
            }
        };

        fetchNotificationPreference();
    }, [deviceId, navigate]);

    const handleNotificationChange = async (e) => {
        const newValue = e.target.value === "yes";
        const previousValue = receiveNotifications;
        setReceiveNotifications(newValue);

        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the Authorization header
                },
                body: JSON.stringify({ receiveAutomationNotification: newValue }),
            });

           if (response.status === 401) {
                navigate("/login");
            } else {
                throw new Error(`Failed to update notification preference: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Error updating notification preference:", err);
            setReceiveNotifications(previousValue); // Revert state on failure
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-8 mb-6 w-full px-4">
            <div
                className="w-full bg-[#3B342D] text-white p-6 rounded-lg shadow-md"
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }}
            >
                {/* Notification Preference Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="text-lg font-bold text-gray-200 text-center leading-tight mb-4">
                        <span>Receive notifications relating to</span>
                        <br />
                        <span>this device automations?</span>
                    </div>
                    <select
                        aria-label="Receive notifications for this device"
                        value={receiveNotifications ? "yes" : "no"}
                        onChange={handleNotificationChange}
                        className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                {/* Children content */}
                {children}
            </div>
        </div>
    );
}
