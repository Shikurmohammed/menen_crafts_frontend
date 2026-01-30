import { ReactNode } from "react";
import { UserRole } from "./enums/user_role";

export interface User {
    rating: any;
    craftsCount: ReactNode;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}