'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Clear NextAuth session
                await signOut({
                    callbackUrl: '/',
                    redirect: false
                });

                // Redirect to home page
                router.push('/');
            } catch (error) {
                console.error('Error during logout:', error);
                // Fallback redirect
                router.push('/');
            }
        };

        // Small delay to ensure the page loads properly
        const timer = setTimeout(handleLogout, 100);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold">Logging out...</h2>
                <p className="text-gray-300 mt-2">Please wait while we clear your session</p>
            </div>
        </div>
    );
}
