import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";

function UserHeader() {
    const { houseId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/users/${houseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else if (response.status === 401) {
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
                            src={`data:image/png;base64,${userData.profilePicture}`}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />

                    </div>
                </div>

                <div className="flex space-x-4">
                    <NotificationDropdown />

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
