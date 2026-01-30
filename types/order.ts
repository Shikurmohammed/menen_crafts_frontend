import { OrderStatus } from "./enums/order_status";
import { OrderItem } from "./order-item";
import { User } from "./user";

export interface Order {
    id: number;
    orderNumber: string;
    user: User;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress?: string;
    billingAddress?: string;
    trackingNumber?: string;
    notes?: string;
    createdAt: string;
    completedAt?: string;
}

