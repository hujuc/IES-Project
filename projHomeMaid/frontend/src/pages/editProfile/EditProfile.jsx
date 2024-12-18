import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProfile() {
    const { houseId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        profilePicture: null,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState(null); // Estado para mensagem de sucesso/erro

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${houseId}`,{
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const { name, profilePicture } = response.data;
                setFormData({ name, profilePicture });
                setPreview(profilePicture);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [houseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append("name", formData.name);
        if (profilePic) {
            updatedData.append("profilePic", profilePic);
        }
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${houseId}/editProfile`,
                updatedData,
                { headers: { "Content-Type": "multipart/form-data",  Authorization: `Bearer ${token}`,} }
            );

            setMessage({ text: "Profile updated successfully!", type: "success" });
            // Redireciona para a HomePage após 2 segundos
            setTimeout(() => navigate(-1), 1000);

            if(response.status === 403){
                navigate("/login");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ text: "Failed to update profile.", type: "error" });
        }
    };

    const handleCancel = () => {
        navigate(-1); // Redireciona para a HomePage
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Top Orange Wave */}
            <div className="relative w-full">
                <div className="bg-orange-500 h-24 w-full"></div>
                <svg
                    className="absolute bottom-0 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    style={{ marginBottom: "-2px" }}
                >
                    <path
                        fill="#ffffff"
                        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,234.7C1200,224,1320,160,1380,128L1440,96L1440,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Main Form Section */}
            <div className="flex-grow flex items-center justify-center px-4 py-6 bg-white-50">
                <div className="bg-gray-100 shadow-lg rounded-lg p-6 w-full max-w-sm">
                    <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">Edit Profile</h2>

                    {/* Mensagem de Sucesso/Erro */}
                    {message && (
                        <div
                            className={`text-sm text-center mb-4 py-2 rounded ${
                                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="form-control mb-4">
                            <label className="label text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-50"
                                required
                            />
                        </div>
                        <div className="form-control mb-8">
                            <label className="label text-gray-700">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered w-full text-sm bg-white"
                            />
                        </div>

                        {/* Botões Save e Cancel */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn w-1/2 bg-gray-400 text-white mr-2 border-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn w-1/2 bg-orange-500 text-white border-none"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Orange Wave */}
            <div className="relative w-full">
                <svg
                    className="absolute top-0 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                >
                    <path
                        fill="#ffffff"
                        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,234.7C1200,224,1320,160,1380,128L1440,96L1440,0L0,0Z"
                    ></path>
                </svg>
                <div className="bg-orange-500 h-24 w-full"></div>
            </div>
        </div>
    );
}

export default EditProfile;
