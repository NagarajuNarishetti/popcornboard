// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// export default function RegisterPage() {
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         firstName: '',
//         lastName: '',
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');
//         setSuccess('');

//         // Validate passwords match
//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch('/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: formData.username,
//                     email: formData.email,
//                     password: formData.password,
//                     firstName: formData.firstName,
//                     lastName: formData.lastName,
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setSuccess('Account created successfully! You can now log in.');
//                 setTimeout(() => {
//                     router.push('/auth/signin');
//                 }, 2000);
//             } else {
//                 // Extract the most useful error message
//                 let errorMessage = data.error || 'Failed to create account';

//                 // If we have details, add them to the error message for development
//                 if (process.env.NODE_ENV === 'development' && data.details) {
//                     console.error('Registration error details:', data.details);

//                     if (typeof data.details === 'string') {
//                         errorMessage += `: ${data.details}`;
//                     } else if (data.details.message) {
//                         errorMessage += `: ${data.details.message}`;
//                     } else if (data.details.responseText) {
//                         // Try to extract useful information from responseText
//                         const responseText = data.details.responseText;
//                         if (responseText.length < 100) {
//                             errorMessage += `: ${responseText}`;
//                         }
//                     }
//                 }

//                 // Handle specific error cases
//                 if (errorMessage.toLowerCase().includes('already exists')) {
//                     errorMessage = 'This username or email is already registered. Please try another or sign in.';
//                 } else if (errorMessage.toLowerCase().includes('connect') || 
//                            errorMessage.toLowerCase().includes('unavailable')) {
//                     errorMessage = 'Cannot connect to the authentication server. Please try again later.';
//                 } else if (errorMessage.toLowerCase().includes('permission') || 
//                            errorMessage.toLowerCase().includes('privileges') || 
//                            errorMessage.toLowerCase().includes('unauthorized')) {
//                     errorMessage = 'Registration failed due to authentication issues. Please contact support.';
//                 } else if (errorMessage.toLowerCase().includes('configuration')) {
//                     errorMessage = 'Server configuration error. Please contact support.';
//                 }

//                 setError(errorMessage);
//                 console.error('Registration error:', data);
//             }
//         } catch (error) {
//             console.error('Registration form error:', error);

//             // Provide more specific error message based on the error
//             let errorMessage = 'Network error. Please try again.';

//             if (error instanceof Error) {
//                 console.error('Error details:', {
//                     name: error.name,
//                     message: error.message,
//                     stack: error.stack
//                 });

//                 // Check for specific error types
//                 if (error.name === 'TypeError' && 
//                     (error.message.includes('fetch') || 
//                      error.message.includes('network') || 
//                      error.message.includes('Failed to fetch'))) {
//                     errorMessage = 'Cannot connect to the server. Please check your internet connection and try again.';
//                 } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
//                     errorMessage = 'The request timed out. Please try again later.';
//                 } else if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
//                     errorMessage = 'The server returned an invalid response. Please try again later or contact support.';
//                 } else if (error.message.includes('abort') || error.message.includes('cancelled')) {
//                     errorMessage = 'The request was cancelled. Please try again.';
//                 } else if (error.message) {
//                     // For development, show the actual error message
//                     if (process.env.NODE_ENV === 'development') {
//                         errorMessage = `Error: ${error.message}`;
//                     } else {
//                         // For production, show a generic message
//                         errorMessage = 'An unexpected error occurred. Please try again later.';
//                     }
//                 }
//             }

//             setError(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
//             <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-white mb-2">🍿 PopcornBoard</h1>
//                     <h2 className="text-xl text-gray-300">Create Account</h2>
//                 </div>

//                 {error && (
//                     <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
//                         {success}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="username" className="block text-white text-sm font-medium mb-2">
//                             Username *
//                         </label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter username"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
//                             Email *
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter email"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="firstName" className="block text-white text-sm font-medium mb-2">
//                                 First Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 name="firstName"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="First name"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="lastName" className="block text-white text-sm font-medium mb-2">
//                                 Last Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 name="lastName"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="Last name"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
//                             Password *
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter password"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
//                             Confirm Password *
//                         </label>
//                         <input
//                             type="password"
//                             id="confirmPassword"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Confirm password"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
//                     >
//                         {isLoading ? 'Creating Account...' : 'Create Account'}
//                     </button>
//                 </form>

//                 <div className="text-center mt-6">
//                     <p className="text-gray-300">
//                         Already have an account?{' '}
//                         <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 underline">
//                             Sign in here
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    const handleRegister = () => {
        router.push(
            'http://localhost:8080/realms/myrealm/login-actions/registration?client_id=nextjs-client&tab_id=MusQ9sgqUsI'
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🍿 PopcornBoard</h1>
                    <h2 className="text-xl text-gray-300">Create Account</h2>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Register with Keycloak
                    </button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
