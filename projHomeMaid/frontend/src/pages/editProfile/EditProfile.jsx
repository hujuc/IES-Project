import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProfile() {
    const { houseId } = useParams(); // Pegando o houseId da URL
    const [formData, setFormData] = useState({
        name: "",
        profilePicture: null,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null); // Estado para o arquivo selecionado
    const [preview, setPreview] = useState(null); // Estado para a pré-visualização da imagem


    useEffect(() => {
        // Buscar os dados atuais do usuário
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${houseId}`);
                const { name, profilePicture } = response.data;

                setFormData({ name, profilePicture });
                setPreview(profilePicture); // Exibir imagem atual
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
            setProfilePic(file); // Armazena o arquivo no estado
            setPreview(URL.createObjectURL(file)); // Atualiza a pré-visualização
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append("name", formData.name); // Nome atualizado
        if (profilePic) {
            updatedData.append("profilePic", profilePic); // Adiciona a imagem somente se for fornecida
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${houseId}/editProfile`,
                updatedData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("Profile updated successfully:", response.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };


    return (
        <div className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">Edit Profile</h2>
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
                <div className="form-control mb-4">
                    <label className="label text-gray-700">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full text-sm bg-white"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-20 h-20 rounded-full mt-4 mx-auto"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-full bg-orange-500 text-white border-none"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
