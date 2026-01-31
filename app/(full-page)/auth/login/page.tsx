/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { authService } from '@/services/auth.service';
import { redirectByRole } from '@/utils/redirectByRole';
import { decodeToken } from '@/utils/decodeJwt';
import { isAuthenticated } from '@/guards/auth-guard';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );
    useEffect(() => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('access_token');
            if (token) {
                const decoded = decodeToken(token);
                redirectByRole(decoded.role, router);
            }
        }
    }, [router]);


    const handleLogin = async () => {
        try {
            setLoading(true);

            const data = await authService.login(email, password);
            console.log('Login successful', data);

            // Store token
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Decode role
            const decoded = decodeToken(data.access_token);

            // Redirect by role
            redirectByRole(decoded.role, router);

        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="w-full surface-card py-8 px-5 sm:px-8">
                    <div className="text-center mb-5">
                        <img src="/layout/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">
                            Welcome to Menen Crafts!
                        </div>
                        <span className="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <label className="block text-900 text-xl font-medium mb-2">Email</label>
                    <InputText
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full md:w-30rem mb-5"
                        style={{ padding: '1rem' }}
                    />

                    <label className="block text-900 font-medium text-xl mb-2">Password</label>
                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        toggleMask
                        className="w-full mb-5"
                        inputClassName="w-full p-3 md:w-30rem"
                    />

                    <div className="flex align-items-center justify-content-between mb-5">
                        <div className="flex align-items-center">
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.checked ?? false)}
                                className="mr-2"
                            />
                            <label>Remember me</label>
                        </div>
                    </div>

                    <Button
                        label="Sign In"
                        className="w-full p-3 text-xl"
                        loading={loading}
                        onClick={handleLogin}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
