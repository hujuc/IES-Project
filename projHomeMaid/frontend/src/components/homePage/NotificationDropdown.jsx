import React, { useState, useEffect, useRef } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import automationNotificationIcon from "../../assets/homePage/notifications/automationNotificationIcon.png";
import generalNotificationIcon from "../../assets/homePage/notifications/automationNotificationIcon.png";

function NotificationDropdown() {
    const { houseId } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState({
        new: [],
        read: [],
    });
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("new");
    const dropdownRef = useRef(null);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/notifications/house/${houseId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const allNotifications = response.data;
                setNotifications({
                    new: allNotifications.filter((n) => !n.read),
                    read: allNotifications.filter((n) => n.read),
                });
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        const socket = new SockJS(
            `${import.meta.env.VITE_API_URL.replace("/api", "/ws/notifications")}`
        );
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/notifications", (message) => {
                    const newNotification = JSON.parse(message.body);
                    setNotifications((prev) => ({
                        ...prev,
                        new: [newNotification, ...prev.new],
                    }));
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [houseId, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const markAsRead = async (notification) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/notifications/read`,
                { mongoId: notification.mongoId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) => ({
                new: prev.new.filter((n) => n.mongoId !== notification.mongoId),
                read: [notification, ...prev.read],
            }));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotification = async (notification) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`${import.meta.env.VITE_API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
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

    const getNotificationIcon = (type) => {
        switch (type) {
            case "automationNotification":
                return automationNotificationIcon;
            default:
                return generalNotificationIcon;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button className="p-2 rounded-full hover:bg-gray-600 relative" onClick={toggleDropdown}>
                <IoMdNotifications className="w-8 h-8 text-gray-300 hover:text-white" />
                {notifications.new.length > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full px-2">
                        {notifications.new.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>

                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 p-2 ${
                                activeTab === "new" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("new")}
                        >
                            New
                        </button>
                        <button
                            className={`flex-1 p-2 ${
                                activeTab === "read" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("read")}
                        >
                            Read
                        </button>
                    </div>

                    <ul className="max-h-60 overflow-y-auto">
                        {activeTab === "new" &&
                            notifications.new.map((n) => (
                                <li key={n.mongoId} className="p-4 border-b flex items-center">
                                    <img
                                        src={getNotificationIcon(n.type)}
                                        alt="Notification Icon"
                                        className="w-10 h-10 mr-4"
                                    />
                                    <div className="flex-1">
                                        <p>{n.text}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={() => markAsRead(n)}
                                                className="text-orange-500 hover:text-orange-700 text-sm"
                                            >
                                                Mark as Read
                                            </button>
                                            <p className="text-blue-600 text-sm">{getTimeElapsed(n.timestamp)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}

                        {activeTab === "read" &&
                            notifications.read.map((n) => (
                                <li key={n.mongoId} className="p-4 border-b flex items-center">
                                    <img
                                        src={getNotificationIcon(n.type)}
                                        alt="Notification Icon"
                                        className="w-10 h-10 mr-4"
                                    />
                                    <div className="flex-1">
                                        <p>{n.text}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={() => deleteNotification(n)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Delete
                                            </button>
                                            <p className="text-blue-600 text-sm">{getTimeElapsed(n.timestamp)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
