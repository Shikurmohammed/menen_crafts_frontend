import { ReactNode } from "react";
import { Category } from "./category";
import { Review } from "./review";
import { User } from "./user";

export interface Craft {
    wishlistCount: ReactNode;
    reviewCount: any;
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    isAvailable: boolean;
    views: number;
    specifications?: Record<string, any>;
    artisan: User;
    categories: Category[];
    reviews?: Review[];
    averageRating: number;
    createdAt: string;
    updatedAt: string;

}