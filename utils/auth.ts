import { api } from "@/services/api.service";

export const logout = async () => {
    try {
        // await fetch('/api/auth/logout', {
        //     method: 'POST',
        //     credentials: 'include'
        // });
        await api.post('/auth/logout', { withCredentials: true });
    } catch (e) {
        console.error('Logout failed', e);
    } finally {
        window.location.href = '/auth/login';
    }
};
