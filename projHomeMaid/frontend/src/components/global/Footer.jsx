import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate(); // Hook para redirecionamento

    return (
        <div
            className="bg-white py-4 flex justify-center space-x-6 text-gray-600 text-sm"
            style={{ boxShadow: "0 -4px 6px -2px rgba(0, 0, 0, 0.1)" }} // Custom top shadow
        >
            {/* Link para Help */}
            <button
                onClick={() => navigate("/help")}
                className="flex items-center hover:text-orange-500"
            >
                <span className="mr-1">❓</span> Help
            </button>

            <span className="border-l border-gray-300 h-5"></span>

            {/* Link para About Us */}
            <button
                onClick={() => navigate("/aboutUs")}
                className="flex items-center hover:text-orange-500"
            >
                <span className="mr-1">ℹ️</span> About Us
            </button>
        </div>
    );
}

export default Footer;
