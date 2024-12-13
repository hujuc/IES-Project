import React, { useState, useEffect } from "react";

export default function AutomationBox({ deviceId, children }) {
    const [receiveNotifications, setReceiveNotifications] = useState(true);

    useEffect(() => {
        // Fetch the device's notification preference
        const fetchNotificationPreference = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`);
                const data = await response.json();
                if (data.receiveAutomationNotification !== undefined) {
                    setReceiveNotifications(data.receiveAutomationNotification);
                }
            } catch (err) {
                console.error("Error fetching notification preference:", err);
            }
        };

        fetchNotificationPreference();
    }, [deviceId]);

    const handleNotificationChange = async (e) => {
        const newValue = e.target.value === "yes";
        setReceiveNotifications(newValue);

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/devices/${deviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ receiveAutomationNotification: newValue }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update notification preference: ${response.statusText}`);
            }

            console.log("Notification preference updated successfully:", newValue);
        } catch (err) {
            console.error("Error updating notification preference:", err);
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
