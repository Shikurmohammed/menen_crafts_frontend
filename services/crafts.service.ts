import { Craft } from "@/types/craft";
import { api } from "./api.service";

export const craftsService = {
    getAll: (params?: any) => api.get('/crafts', { params }),
    getById: (id: string) => api.get(`/crafts/${id}`),
    create: (data: any) => api.post('/crafts', data),
    update: (id: string, data: any) => api.patch(`/crafts/${id}`, data),
    delete: (id: string) => api.delete(`/crafts/${id}`),
    getByArtisan: (artisanId: string) => api.get(`/crafts/artisan/${artisanId}`),

    async getFeatured(): Promise<Craft[]> {
        const res = await api.get(`/crafts`);
        return res.data;
    }
};
