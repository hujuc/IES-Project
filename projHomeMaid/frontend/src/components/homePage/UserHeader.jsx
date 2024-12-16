import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import React Router to access URL params and navigation
import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";

function UserHeader() {
    const { houseId } = useParams(); // Get the houseId from the URL
    const navigate = useNavigate(); // Use navigate to redirect users
    const [userData, setUserData] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch user data based on houseId
        const fetchUserData = async () => {
            const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from localStorage

            if (!token) {
                // Redirect to login if token is missing
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/users/${houseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT token in the header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else if (response.status === 401) {
                    // If unauthorized, clear the token and redirect to login
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                } else {
                    console.error("User not found or server error");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [houseId, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    return (
        <div className="bg-transparent text-gray-300 p-5">
            <div className="flex justify-between items-start">
                <div>
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                            src={`data:image/png;base64,${userData.profilePicture}`} // Usa a imagem Base64
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />

                    </div>
                </div>

                <div className="flex space-x-4">
                    {/* Notification Dropdown */}
                    <NotificationDropdown />

                    {/* Settings Dropdown */}
                    <SettingsDropdown />
                </div>
            </div>

            <div className="mt-4">
                <h1 className="text-xl font-semibold text-white">
                    Hi, {userData.name}
                </h1>
                <p className="text-sm text-gray-400">
                    Monitor and Control your house
                </p>
            </div>
        </div>
    );
}

export default UserHeader;
