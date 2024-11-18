import React, { useState, useEffect, useRef } from "react";
import { IoMdSettings } from "react-icons/io";

function SettingsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
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

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Settings Button */}
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-gray-600"
            >
                <IoMdSettings className="w-8 h-8 text-gray-300 hover:text-white" />
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#E7E7E7] text-gray-800 rounded-lg shadow-lg">
                    <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer">
                            Edit My Profile
                        </li>
                        {/* Divider */}
                        <hr className="border-t border-[#B0B0B0] mx-4" />
                        <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer text-red-500">
                            Log Out
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SettingsDropdown;
