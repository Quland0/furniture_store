import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const baseURL = `${API_URL}/api`;

export const $host = axios.create({ baseURL });
export const $authHost = axios.create({ baseURL });

$authHost.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});
