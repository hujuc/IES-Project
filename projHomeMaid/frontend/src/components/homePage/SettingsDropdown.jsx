import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";

function SettingsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { houseId } = useParams();

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

    const handleLogOut = () => {
        localStorage.removeItem("jwtToken");

        localStorage.removeItem("houseId");

        navigate("/");
    };


    const handleEditProfile = () => {
        navigate(`/edit-profile/${houseId}`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-gray-600"
            >
                <IoMdSettings className="w-8 h-8 text-gray-300 hover:text-white" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#E7E7E7] text-gray-800 rounded-lg shadow-lg">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                            onClick={handleEditProfile}
                        >
                            Edit My Profile
                        </li>
                        <hr className="border-t border-[#B0B0B0] mx-4" />
                        <li
                            onClick={handleLogOut}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer text-red-500"
                        >
                            Log Out
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SettingsDropdown;
