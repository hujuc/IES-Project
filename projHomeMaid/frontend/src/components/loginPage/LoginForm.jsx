import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(""); // To display error messages
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const { email, password } = formData;

        if (!email || !password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/login`,
                {
                    email,
                    password,
                }
            );

            // Step 2: Store the JWT token securely
            const token = response.data.token;

            // Use localStorage (or sessionStorage) to store the JWT token
            localStorage.setItem("jwtToken", token);

            // Optionally store additional data (e.g., houseId)
            const houseId = response.data.houseId;
            localStorage.setItem("houseId", houseId);

            // Navigate to the home page
            navigate(`/homePage/${houseId}`);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error); // Usa a mensagem retornada pelo backend
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto"
        >
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">
                Log In
            </h2>

            {/* Error Message */}
            {errorMessage && (
                <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Email Input */}
            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Email</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="input input-bordered w-full bg-gray-50"
                />
            </div>

            {/* Password Input */}
            <div className="form-control w-full mb-6">
                <label className="label">
                    <span className="label-text text-gray-700">Password</span>
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input input-bordered w-full bg-gray-50"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="btn btn-primary w-full bg-orange-500 text-white border-none"
            >
                Log In
            </button>
        </form>
    );
}

export default LoginForm;