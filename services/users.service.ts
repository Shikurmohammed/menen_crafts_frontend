import { api } from "./api.service";

export const usersService = {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    update: (id: string, data: any) => api.patch(`/users/${id}`, data),
};
