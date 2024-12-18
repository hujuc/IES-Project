import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/navBar/logo.png"

function NavBar() {
    const navigate = useNavigate();

    return (
        <div className="navbar bg-white shadow-lg px-2 py-2 sticky top-0 z-50">
            <div className="navbar-start">
                <img
                    src={logo}
                    className="w-12 h-12 lg:w-16 lg:h-16 mx-2 cursor-pointer"
                    alt="HomeMaid Logo"
                    onClick={() => navigate("/")}
                />
            </div>

            <div className="navbar-end space-x-2">
                <button
                    className="btn bg-orange-500 text-white hover:bg-orange-600 transition-all border-none px-3 py-1"
                    onClick={() => navigate("/signUp")}
                >
                    Sign Up
                </button>

                <button
                    className="btn bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 transition-all px-3 py-1"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </button>
            </div>
        </div>
    );
}

export default NavBar;
