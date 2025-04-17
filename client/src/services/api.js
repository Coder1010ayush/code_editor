// client/src/services/api.js
import axios from 'axios';

// Configure axios instance
const api = axios.create({
    baseURL: '/api', // Uses proxy in development, needs full URL in production if not served together
    withCredentials: true, // Important: Send cookies with requests!
});

// Auth API calls
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');
export const fetchCurrentUser = () => api.get('/auth/me');

// You can add other API calls here (e.g., for problems)
export const fetchProblems = () => api.get('/problems');

export default api;