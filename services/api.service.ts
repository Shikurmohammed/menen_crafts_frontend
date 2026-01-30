import axios from 'axios';
import { error } from 'console';
import { headers } from 'next/dist/client/components/headers';
import { config } from 'process';
const API_URL = 'http://localhost:5000/api';//process.env.API_URL ||
export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});
//Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error))
//Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }

);

