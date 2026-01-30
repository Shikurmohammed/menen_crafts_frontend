import { api } from "./api.service";

export const authService = {

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        return response.data; // ✅ RETURN PAYLOAD ONLY
    },

    register: (userData: any) => api.post('/auth/register', userData),

    getProfile: () => api.post('/auth/profile'),

    logout: () => {
        // Logic to log out user
    },

    resetPassword: (email: string) => {
        // Logic to reset user password
    },


};