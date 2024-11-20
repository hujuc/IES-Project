import React, { useState, useEffect, useRef } from "react";
import { IoMdNotifications } from "react-icons/io";

function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("new");
    const [notifications, setNotifications] = useState({
        new: [
            {
                id: 1,
                message: "Lamp in Living Room was turned off after 3 hours, as you requested.",
                time: "3h ago",
            },
            {
                id: 2,
                message: "Living room Air conditioner isn't functioning properly.",
                time: "2h ago",
            },
            {
                id: 3,
                message: "The front door was left open for 10 minutes.",
                time: "6h ago",
            },
        ],
        read: [],
    });

    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const markAsRead = (id) => {
        setNotifications((prev) => {
            const notificationToMark = prev.new.find((n) => n.id === id);
            return {
                new: prev.new.filter((n) => n.id !== id),
                read: [notificationToMark, ...prev.read],
            };
        });
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => ({
            ...prev,
            read: prev.read.filter((n) => n.id !== id),
        }));
    };

    const deleteAllRead = () => {
        setNotifications((prev) => ({
            ...prev,
            read: [],
        }));
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

                    {/* Content for the Active Tab */}
                    <ul className="max-h-60 overflow-y-auto">
                        {activeTab === "new" && (
                            <>
                                {notifications.new.length > 0 ? (
                                    notifications.new.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className="flex items-center p-4 mb-2 bg-[#D9D9D9] rounded-[25px]"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    {notification.message}
                                                </p>
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-orange-500 text-sm mt-2"
                                                >
                                                    Mark as Read
                                                </button>
                                            </div>
                                            <span className="text-gray-400 text-xs">
                                                {notification.time}
                                            </span>
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
                                        {notifications.read.map((notification) => (
                                            <li
                                                key={notification.id}
                                                className="flex items-center p-4 mb-2 bg-[#D9D9D9] rounded-[25px]"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="text-red-500 text-sm"
                                                >
                                                    Delete
                                                </button>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {notification.time}
                                                </span>
                                            </li>
                                        ))}
                                        {/* Delete All Read Button */}
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
