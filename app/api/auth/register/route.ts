// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { username, email, password, firstName, lastName } = await request.json();

//     // Validate input
//     if (!username || !email || !password) {
//       return NextResponse.json(
//         { error: 'Username, email, and password are required' },
//         { status: 400 }
//       );
//     }

//     // Get admin token from Keycloak
//     try {
//       console.log('Attempting to get admin token with:', {
//         issuer: process.env.KEYCLOAK_ISSUER,
//         username: process.env.KEYCLOAK_ADMIN_USER,
//         // Don't log the actual password
//         hasPassword: !!process.env.KEYCLOAK_ADMIN_PASSWORD
//       });

//       const adminTokenResponse = await fetch(
//         `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: new URLSearchParams({
//             username: process.env.KEYCLOAK_ADMIN_USER!,
//             password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
//             grant_type: 'password',
//             client_id: 'admin-cli',
//           }),
//         }
//       );

//       if (!adminTokenResponse.ok) {
//         const responseText = await adminTokenResponse.text();
//         console.error('Failed to get admin token:', responseText);

//         let errorMessage = 'Failed to authenticate with Keycloak admin';
//         let errorDetails = { status: adminTokenResponse.status };

//         try {
//           // Try to parse the error response as JSON
//           const errorJson = JSON.parse(responseText);
//           if (errorJson.error_description) {
//             errorMessage = `Keycloak admin authentication failed: ${errorJson.error_description}`;
//           }
//           errorDetails = { ...errorDetails, ...errorJson };
//         } catch (e) {
//           // If not JSON, use the text
//           errorDetails = { ...errorDetails, responseText };
//         }

//         return NextResponse.json(
//           { error: errorMessage, details: errorDetails },
//           { status: adminTokenResponse.status }
//         );
//       }
//     } catch (error) {
//       console.error('Error during admin token request:', error);
//       return NextResponse.json(
//         { 
//           error: 'Failed to connect to Keycloak authentication server', 
//           details: error instanceof Error ? { message: error.message } : {}
//         },
//         { status: 503 } // Service Unavailable
//       );
//     }

//     const adminTokenData = await adminTokenResponse.json();

//     if (!adminTokenData.access_token) {
//       return NextResponse.json(
//         { error: 'Failed to get admin token' },
//         { status: 500 }
//       );
//     }

//     // Create user in Keycloak
//     const createUserResponse = await fetch(
//       `${process.env.KEYCLOAK_ISSUER}/admin/users`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${adminTokenData.access_token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username,
//           email,
//           emailVerified: true,
//           enabled: true,
//           firstName: firstName || username,
//           lastName: lastName || '',
//           credentials: [
//             {
//               type: 'password',
//               value: password,
//               temporary: false,
//             },
//           ],
//         }),
//       }
//     );

//     if (!createUserResponse.ok) {
//       let errorMessage = 'Failed to create user';
//       let errorDetails = { status: createUserResponse.status };

//       try {
//         const responseText = await createUserResponse.text();
//         console.error('User creation response:', responseText);

//         try {
//           // Try to parse as JSON
//           const errorData = JSON.parse(responseText);
//           errorDetails = { ...errorDetails, ...errorData };

//           // Extract more specific error message if available
//           if (errorData.errorMessage) {
//             errorMessage = errorData.errorMessage;
//           } else if (errorData.error) {
//             errorMessage = errorData.error;
//           } else if (errorData.error_description) {
//             errorMessage = errorData.error_description;
//           }

//           // Check for duplicate user
//           if (createUserResponse.status === 409 || 
//               (errorMessage && errorMessage.toLowerCase().includes('exists')) ||
//               (responseText && responseText.toLowerCase().includes('exists'))) {
//             errorMessage = 'Username or email already exists';
//           }
//         } catch (jsonError) {
//           // If we can't parse the JSON, use the text
//           errorDetails = { ...errorDetails, responseText };

//           // Check for common error patterns in the text
//           if (responseText.toLowerCase().includes('exists')) {
//             errorMessage = 'Username or email already exists';
//           } else if (responseText.toLowerCase().includes('invalid')) {
//             errorMessage = 'Invalid user data provided';
//           } else if (responseText.toLowerCase().includes('permission')) {
//             errorMessage = 'Permission denied: Admin user may not have sufficient privileges';
//           }
//         }
//       } catch (textError) {
//         // If we can't get the text either, just use the status
//         console.error('Failed to read error response text:', textError);
//       }

//       // Map HTTP status codes to more user-friendly messages
//       if (errorMessage === 'Failed to create user') {
//         if (createUserResponse.status === 401 || createUserResponse.status === 403) {
//           errorMessage = 'Authentication failed: Admin user may not have sufficient privileges';
//         } else if (createUserResponse.status === 400) {
//           errorMessage = 'Invalid user data provided';
//         } else if (createUserResponse.status === 404) {
//           errorMessage = 'Keycloak API endpoint not found. Check server configuration.';
//         } else if (createUserResponse.status === 500) {
//           errorMessage = 'Keycloak server error. Please try again later.';
//         }
//       }

//       console.error('User creation failed:', errorMessage, errorDetails);

//       return NextResponse.json(
//         { error: errorMessage, details: errorDetails },
//         { status: createUserResponse.status }
//       );
//     }

//     return NextResponse.json(
//       { message: 'User created successfully' },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Registration error:', error);

//     // Provide more specific error message if possible
//     let errorMessage = 'Internal server error';
//     let statusCode = 500;
//     let errorDetails = {};

//     if (error instanceof Error) {
//       errorMessage = error.message || errorMessage;
//       errorDetails = { 
//         message: error.message,
//         name: error.name,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       };

//       // Check for network errors
//       if (error.message.includes('fetch') || 
//           error.message.includes('network') || 
//           error.message.includes('ECONNREFUSED') || 
//           error.message.includes('ETIMEDOUT')) {
//         errorMessage = 'Could not connect to authentication server. Please try again later.';
//         statusCode = 503; // Service Unavailable
//       }

//       // Check for Keycloak-specific errors
//       if (error.message.includes('Keycloak') || error.message.includes('realm')) {
//         errorMessage = 'Authentication service error. Please contact support.';
//       }

//       // Check for environment variable issues
//       if (error.message.includes('undefined') && 
//           (error.message.includes('KEYCLOAK_ISSUER') || 
//            error.message.includes('KEYCLOAK_ADMIN_USER') || 
//            error.message.includes('KEYCLOAK_ADMIN_PASSWORD'))) {
//         errorMessage = 'Server configuration error: Missing Keycloak environment variables.';
//         statusCode = 500;

//         // Log the environment variables (without sensitive values)
//         console.error('Environment check:', {
//           hasIssuer: !!process.env.KEYCLOAK_ISSUER,
//           hasAdminUser: !!process.env.KEYCLOAK_ADMIN_USER,
//           hasAdminPassword: !!process.env.KEYCLOAK_ADMIN_PASSWORD
//         });
//       }
//     }

//     return NextResponse.json(
//       { 
//         error: errorMessage,
//         details: errorDetails
//       },
//       { status: statusCode }
//     );
//   }
// }




'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = () => {
    // Redirect to your Keycloak registration URL
    router.push(
      'http://localhost:8080/realms/myrealm/login-actions/registration?client_id=nextjs-client'
    );
  };

  return (
    <div className= "min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4" >
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md" >
      <div className="text-center mb-8" >
        <h1 className="text-3xl font-bold text-white mb-2" >🍿 PopcornBoard </h1>
          < h2 className = "text-xl text-gray-300" > Create Account </h2>
            </div>

            < div className = "space-y-4" >
              <button
            onClick={ handleRegister }
  className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
    >
    Register with Keycloak
    </button>
    </div>

    < div className = "text-center mt-6" >
      <p className="text-gray-300" >
        Already have an account ? { ' '}
          < Link href = "/auth/signin" className = "text-blue-400 hover:text-blue-300 underline" >
            Sign in here
            </Link>
            </p>
            </div>
            </div>
            </div>
  );
}
