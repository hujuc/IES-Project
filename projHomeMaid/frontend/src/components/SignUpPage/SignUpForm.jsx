import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


function SignUpForm() {
    const [formData, setFormData] = useState({
        contractCode: '',
        name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };


    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profilePic) {
            setErrorMessage("Profile picture is required.");
            return;
        }

        const formPayload = new FormData();
        formPayload.append("houseId", formData.contractCode);
        formPayload.append("name", formData.name);
        formPayload.append("email", formData.email);
        formPayload.append("password", formData.password);
        formPayload.append("profilePicture", profilePic);

        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/users/signUp", formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setErrorMessage("");
            navigate("/login");
        } catch (error) {
            console.error("Error signing up:", error.response?.data || error.message);

            const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";

            const cleanMessage = errorMessage.replace(/Error:\s?\d+\s?\w+\s?/, "");

            setErrorMessage(cleanMessage);
        }
    };



    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <form onSubmit={handleSubmit}
              className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">Sign Up</h2>

            {/* Mensagem de erro */}
            {errorMessage && (
                <div className="mb-4 text-red-500 text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            {/* Contract Code */}
            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Contract Code</span>
                </label>
                <input
                    type="text"
                    name="contractCode"
                    value={formData.contractCode}
                    onChange={handleChange}
                    placeholder="Enter your contract code"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            {/* Name */}
            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Name</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Define your name"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            {/* Email */}
            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Email</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Define your email"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            {/* Password */}
            <div className="form-control w-full mb-6 relative">
                <label className="label">
                    <span className="label-text text-gray-700">Password</span>
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Define your password"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                    {showPassword ? (
                        <AiOutlineEyeInvisible size={24}/> // Ícone do olho fechado
                    ) : (
                        <AiOutlineEye size={24}/> // Ícone do olho aberto
                    )}
                </button>
            </div>

            {/* Profile Picture */}
            <div className="form-control w-full mb-6 relative">
                <label className="label">
                    <span className="label-text text-gray-700">Profile Picture</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full text-sm bg-white"
                />
                {profilePic && (
                    <div className="mt-4">
                        <img src={URL.createObjectURL(profilePic)} alt="Profile Preview"
                             className="w-20 h-20 rounded-full mt-2"/>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full bg-orange-500 text-white border-none">
                Sign Up
            </button>
        </form>


    );
}

export default SignUpForm;