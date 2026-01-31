import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";


export const redirectByRole = (role: string, router: AppRouterInstance) => {
    switch (role) {
        case 'admin':
            router.push('/dashboard/admin');
            break;
        case 'artisan':
            router.push('/dashboard/artisan');
            break;
        case 'user':
            router.push('/dashboard/customer');
            break;
        default:
            router.push('/');
    }
};
