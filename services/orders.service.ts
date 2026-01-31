import { Order } from "@/types/order";
import { api } from "./api.service";
import { get } from "http";

export const ordersService = {
    create: (data: Order) => api.post('/orders', data),
    getMyOrders: (data: Order) => api.get('/orders/my-orders'),
    getById: (id: string) => api.get(`/orders/${id}`),
    getAll: () => api.get('/orders'),
};
