import axios from 'axios';

const API_BASE_URL = 'http://localhost:4003/api/users';

export const signUpUser = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signUp`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || 'Erro ao registrar o usuário no servidor.');
        } else {
            throw new Error('Erro ao conectar com o servidor. Verifique sua conexão.');
        }
    }
};
