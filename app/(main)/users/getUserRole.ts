import { UserRole } from '@/types/enums/user_role';
import { decodeToken } from '@/utils/decodeJwt';

export const getUserRole = (): UserRole | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('access_token');
    if (!token) return null;

    const decoded = decodeToken(token);
    const role = decoded.role as UserRole || null;
    return role;
};