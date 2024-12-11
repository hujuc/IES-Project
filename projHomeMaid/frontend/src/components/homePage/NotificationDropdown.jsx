import React, { useState, useEffect, useRef } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";

// Importing the automation notification icon
import automationNotificationIcon from "../../assets/homePage/notifications/automationNotificationIcon.png";

function NotificationDropdown() {
    const { houseId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("new");
    const [notifications, setNotifications] = useState({
        new: [],
        read: [],
    });

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/notifications/house/${houseId}`
                );
                const allNotifications = response.data;

                // Categorize notifications
                const categorizedNotifications = {
                    new: allNotifications.filter((n) => !n.read),
                    read: allNotifications.filter((n) => n.read),
                };

                setNotifications(categorizedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (houseId) {
            fetchNotifications();
        }
    }, [houseId]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Calculate the time elapsed
    const getTimeElapsed = (timestamp) => {
        const notificationTime = new Date(timestamp);
        const now = new Date();
        const diff = Math.abs(now - notificationTime);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    };

    const markAsRead = async (notification) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/notifications/read`, {
                mongoId: notification.mongoId,
            });

            setNotifications((prev) => {
                const notificationToMark = prev.new.find((n) => n.mongoId === notification.mongoId);
                if (notificationToMark) notificationToMark.read = true;

                return {
                    new: prev.new.filter((n) => n.mongoId !== notification.mongoId),
                    read: [notificationToMark, ...prev.read],
                };
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notification) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/notifications`, {
                data: { mongoId: notification.mongoId },
            });

            setNotifications((prev) => ({
                ...prev,
                read: prev.read.filter((n) => n.mongoId !== notification.mongoId),
            }));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const deleteAllRead = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/notifications/house/${houseId}`);
            setNotifications((prev) => ({
                ...prev,
                read: [],
            }));
        } catch (error) {
            console.error("Error deleting all read notifications:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                className="p-2 rounded-full hover:bg-gray-600 relative"
                onClick={toggleDropdown}
            >
                <IoMdNotifications className="w-8 h-8 text-gray-300 hover:text-white" />
                {notifications.new.length > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full px-2">
                        {notifications.new.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-2 w-80 bg-[#E7E7E7] text-gray-800 rounded-[25px] shadow-lg z-50"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        {notifications.new.length > 0 && (
                            <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full">
                                {notifications.new.length}
                            </span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex text-sm border-b border-gray-200">
                        <button
                            className={`flex-1 p-2 ${
                                activeTab === "new"
                                    ? "text-orange-500 border-b-2 border-orange-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("new")}
                        >
                            New
                        </button>
                        <button
                            className={`flex-1 p-2 ${
                                activeTab === "read"
                                    ? "text-orange-500 border-b-2 border-orange-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("read")}
                        >
                            Read
                        </button>
                    </div>

                    {/* Notifications */}
                    <ul className="max-h-60 overflow-y-auto">
                        {activeTab === "new" && (
                            <>
                                {notifications.new.length > 0 ? (
                                    notifications.new.map((notification, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center p-4 mb-2 bg-[#D9D9D9] rounded-[25px]"
                                        >
                                            <img
                                                src={automationNotificationIcon}
                                                alt="Automation Notification"
                                                className="w-10 h-10 mr-4 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-semibold mb-1">
                                                    {notification.text}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        onClick={() => markAsRead(notification)}
                                                        className="text-orange-500 text-sm"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                    <p className="text-sm text-blue-600 font-bold">
                                                        {getTimeElapsed(notification.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-gray-500">
                                        No new notifications
                                    </li>
                                )}
                            </>
                        )}
                        {activeTab === "read" && (
                            <>
                                {notifications.read.length > 0 ? (
                                    <>
                                        {notifications.read.map((notification, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center p-4 mb-2 bg-[#D9D9D9] rounded-[25px]"
                                            >
                                                <img
                                                    src={automationNotificationIcon}
                                                    alt="Automation Notification"
                                                    className="w-10 h-10 mr-4 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 font-semibold mb-1">
                                                        {notification.text}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            onClick={() =>
                                                                deleteNotification(notification)
                                                            }
                                                            className="text-red-500 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                        <p className="text-sm text-blue-600 font-bold">
                                                            {getTimeElapsed(
                                                                notification.timestamp
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        <li className="p-4 text-center">
                                            <button
                                                onClick={deleteAllRead}
                                                className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete All
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="p-4 text-center text-gray-500">
                                        No read notifications
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
