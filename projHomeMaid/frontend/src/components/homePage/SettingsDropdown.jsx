import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Para redirecionar o usuário
import { IoMdSettings } from "react-icons/io";

function SettingsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // Hook para redirecionar
    const { houseId } = useParams(); // Pegando o houseId para direcionar corretamente

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Fechar dropdown ao clicar fora
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
        // Clear the JWT from local storage
        localStorage.removeItem("jwtToken");

        // Optionally, you can clear other user-related data if needed
        localStorage.removeItem("houseId"); // Example if you're storing user data

        // Redirect the user to the welcome or login page
        navigate("/");
    };


    const handleEditProfile = () => {
        navigate(`/edit-profile/${houseId}`); // Redireciona para a página de edição de perfil
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botão de configurações */}
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-gray-600"
            >
                <IoMdSettings className="w-8 h-8 text-gray-300 hover:text-white" />
            </button>

            {/* Conteúdo do Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#E7E7E7] text-gray-800 rounded-lg shadow-lg">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                            onClick={handleEditProfile}
                        >
                            Edit My Profile
                        </li>
                        {/* Divisor */}
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
