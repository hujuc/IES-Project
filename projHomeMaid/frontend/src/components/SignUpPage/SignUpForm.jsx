import React, { useState } from "react";
import axios from "axios";

function SignUpForm() {
    const [formData, setFormData] = useState({
        contractCode: '',
        name: '',
        email: '',
        password: '',
        profilePic: 'projHomeMaid/frontend/public/no-profile.png',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

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
            setProfilePic(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL+"/users/signUp", {
                houseId: formData.contractCode,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                profilePic: formData.profilePic,
            });

            console.log("User created:", response.data);

            // Optional: Automatically log in the user after signup
            const loginResponse = await axios.post(import.meta.env.VITE_API_URL+"/users/login", {
                email: formData.email,
                password: formData.password,
            });

            // Store JWT in localStorage
            localStorage.setItem("accessToken", loginResponse.data.accessToken);
            alert("Signed up and logged in successfully!");
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Sign-up failed. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">Sign Up</h2>
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
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
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
                        <img src={profilePic} alt="Profile Preview" className="w-20 h-20 rounded-full mt-2" />
                    </div>
                )}
            </div>
            <button type="submit" className="btn btn-primary w-full bg-orange-500 text-white border-none">Sign Up</button>
        </form>
    );
}

export default SignUpForm;