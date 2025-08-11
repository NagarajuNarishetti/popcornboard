import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Keycloak provider (primary for production)
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          // Support for prompt parameter to force login
          // This will be used when prompt=login is passed to signIn
          prompt: "login",
        },
      },
    }),
    // Development credentials provider (fallback for development)
    ...(isDevelopment ? [
      CredentialsProvider({
        name: "Development Login",
        credentials: {
          email: { label: "Email", type: "email" },
          name: { label: "Name", type: "text" },
        },
        async authorize(credentials) {
          if (credentials?.email) {
            return {
              id: "dev-user-" + Date.now(),
              email: credentials.email,
              name: credentials.name || credentials.email.split("@")[0],
            };
          }
          return null;
        },
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // For Keycloak provider, user object is available
      if (session?.user && user) {
        (session.user as any).id = user.id;
      }
      // For Credentials provider, we need to use token
      else if (session?.user && token) {
        (session.user as any).id = token.sub || token.id || 'unknown-id';
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // When signing in, add user info to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // Store provider information and tokens from Keycloak
      if (account) {
        token.provider = account.provider;

        // Store tokens from Keycloak for logout
        if (account.provider === 'keycloak') {
          token.id_token = account.id_token;
          token.refreshToken = account.refresh_token;
        }
      }

      return token;
    },
    // Note: Keycloak logout is now handled client-side in the Header component
    // This ensures proper session clearing on both NextAuth and Keycloak sides
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how frequently to update the session
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: isDevelopment,
});

export { handler as GET, handler as POST };