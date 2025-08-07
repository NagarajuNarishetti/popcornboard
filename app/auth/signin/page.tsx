'use client';

import { signIn, getProviders } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);

      // Check if we're in development mode
      setIsDevelopment(process.env.NODE_ENV === 'development');

      // If Keycloak is available and we're in production, redirect automatically
      if (providers?.keycloak && process.env.NODE_ENV === 'production') {
        try {
          signIn('keycloak', { callbackUrl: '/' });
        } catch (error) {
          console.error('Error signing in with Keycloak:', error);
        }
      }
    };

    loadProviders();
  }, []);

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn('credentials', {
      email,
      name,
      callbackUrl: '/',
    });
  };

  const handleKeycloakSignIn = async () => {
    try {
      // Add prompt=login parameter to force a new login session
      // This ensures Keycloak will ask for credentials again
      await signIn('keycloak', {
        callbackUrl: '/',
        prompt: 'login'
      });
    } catch (error) {
      console.error('Error signing in with Keycloak:', error);
    }
  };

  // If providers are not loaded yet
  if (!providers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">🍿 PopcornBoard</h1>
          <p className="text-xl text-gray-300 mb-6">Loading authentication...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">🍿 PopcornBoard</h1>
        <p className="text-xl text-gray-300 mb-6 text-center">
          {isDevelopment ? 'Development Login' : 'Sign in to PopcornBoard'}
        </p>

        {/* Keycloak Sign In Button */}
        {providers?.keycloak && (
          <div className="mb-6">
            <button
              onClick={handleKeycloakSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
            >
              Sign in with Keycloak
            </button>
          </div>
        )}

        {/* Development Form (only in development) */}
        {isDevelopment && providers?.credentials && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">Or use development login</span>
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1">Name (optional)</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Signing in...
                  </span>
                ) : (
                  'Development Sign In'
                )}
              </button>
            </form>
          </>
        )}

        {!providers?.keycloak && !providers?.credentials && (
          <div className="text-center text-red-300">
            <p>No authentication providers available.</p>
            <p className="text-sm mt-2">Please check your configuration.</p>
          </div>
        )}

        {/* Registration Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-600">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { signIn, useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function SignInPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (status === 'authenticated') {
//       router.push('/');
//     }
//   }, [status, router]);

//   const handleDevLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await signIn('credentials', {
//       email,
//       name,
//       redirect: false,
//       callbackUrl: '/',
//     });

//     if (res?.error) {
//       setError('Login failed');
//     } else if (res?.ok) {
//       router.push('/');
//     }
//   };

//   const handleKeycloakLogin = () => {
//     signIn('keycloak', { callbackUrl: '/' });
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
//         <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

//         {process.env.NODE_ENV === 'development' && (
//           <form onSubmit={handleDevLogin} className="space-y-4">
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full border p-2 rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Name (optional)"
//               className="w-full border p-2 rounded"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             >
//               Sign In (Dev)
//             </button>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//           </form>
//         )}

//         {process.env.NODE_ENV !== 'development' && (
//           <button
//             onClick={handleKeycloakLogin}
//             className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
//           >
//             Sign In with Keycloak
//           </button>
//         )}
//       </div>
//     </main>
//   );
// }
