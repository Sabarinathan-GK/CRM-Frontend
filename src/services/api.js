import axios from 'axios';

const api = axios.create({
    baseURL : "https://crm-backend-8ni3.onrender.com/api",
    headers : {
        "Content-Type" : "application/json"
    }
});

api.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => Promise.reject(error));

export default api;