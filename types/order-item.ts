
import { Craft } from './craft';

export interface OrderItem {
    id: number;
    craft: Craft;
    craftId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    createdAt: string;
    updatedAt: string;
}
