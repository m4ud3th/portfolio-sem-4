"use client";

import { useEffect, useState } from 'react';
import { AuthProvider } from './AuthProvider';

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During server-side rendering, just render children without auth
  if (!isClient) {
    return <>{children}</>;
  }

  // On the client, wrap with AuthProvider
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}