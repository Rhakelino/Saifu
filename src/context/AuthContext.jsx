import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from '../lib/authClient';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export function AuthProvider({ children }) {
    const { data: session, isPending, error } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!session?.user;
    const user = session?.user || null;

    // Redirect logic
    useEffect(() => {
        if (isPending) return; // Wait for session to load

        const isPublicRoute = publicRoutes.includes(location.pathname);

        if (!isAuthenticated && !isPublicRoute) {
            // Not logged in and trying to access protected route
            navigate('/login', { replace: true });
        } else if (isAuthenticated && isPublicRoute) {
            // Logged in but on login/register page
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isPending, location.pathname, navigate]);

    const logout = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    const value = {
        user,
        session,
        isAuthenticated,
        isPending,
        error,
        logout,
    };

    // Show loading while checking auth
    if (isPending) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                    <p className="text-slate-500 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
