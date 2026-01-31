'use client';

import { api } from '@/services/api.service';
import { usersService } from '@/services/users.service';
import { UserRole } from '@/types/enums/user_role';
import { User } from '@/types/user';
import React, { createContext, useContext } from 'react';


const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Normally fetched from API

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
