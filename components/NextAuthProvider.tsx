'use client';

import { SessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      // Force session refetch on mount to avoid stale session data
      refetchInterval={0} 
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}