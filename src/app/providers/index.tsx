'use client';

import QueryProvider from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );

  if (!GOOGLE_CLIENT_ID) return content;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {content}
    </GoogleOAuthProvider>
  );
}
