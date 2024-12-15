import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class AuthService {
    login(credentials) {
        return axios.post(`${API_BASE_URL}/users/login`, credentials);
    }
}

export default new AuthService();
