import { api } from "./api.service";

export const categoriesService = {
    getAll: () => api.get('/categories'),
    create: (data: any) => api.post('/categories', data),
};
