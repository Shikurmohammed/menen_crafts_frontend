import { api } from "./api.service";

export const reviewsService = {
    getByCraft: (craftId: string) => api.get(`/reviews/craft/${craftId}`),
    create: (data: any) => api.post('/reviews', data),
};
