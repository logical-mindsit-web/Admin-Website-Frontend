import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  //baseURL: 'http://localhost:8080',
  baseURL: 'https://admin-website-backend.onrender.com',
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {

      const navigate = useNavigate(); 
      navigate('/'); 
    }
    return Promise.reject(error);
  }
);

export default api;