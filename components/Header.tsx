'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface HeaderProps {
  session: any;
}

export default function Header({ session }: HeaderProps) {
  // Use client-side session for more reliable state during sign-in/out
  const { data: clientSession, status } = useSession();

  // Use client-side session if available, otherwise fall back to server-side session
  const activeSession = clientSession || session;

  const handleSignOut = async () => {
    try {
      // First, redirect to Keycloak logout to clear the Keycloak session
      const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/popcornboard/protocol/openid-connect/logout`;
      const logoutParams = new URLSearchParams({
        client_id: 'nextjs-client',
        post_logout_redirect_uri: `${window.location.origin}/auth/logout`,
      });

      // Redirect to Keycloak logout
      window.location.href = `${keycloakLogoutUrl}?${logoutParams.toString()}`;
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: just clear NextAuth session
      await signOut({ callbackUrl: '/', redirect: true });
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🍿</span>
            <h1 className="text-xl font-bold text-white">PopcornBoard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : activeSession ? (
              <>
                <span className="text-white">
                  Welcome, {activeSession.user?.name || activeSession.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={() => {
                    // Redirect directly to Keycloak registration
                    const keycloakUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/popcornboard/login-actions/registration?client_id=nextjs-client`;
                    window.location.href = keycloakUrl;
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Debug information in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-gray-800 bg-opacity-50 rounded text-xs text-gray-300">
            <div>Session Status: {status}</div>
            <div>Client Session: {clientSession ? 'Yes' : 'No'}</div>
            <div>Server Session: {session ? 'Yes' : 'No'}</div>
            {activeSession?.user && (
              <div>
                User: {activeSession.user.email} / {activeSession.user.name}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}