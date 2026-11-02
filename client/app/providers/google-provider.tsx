
"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIEfNT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId as string}>
      {children}
    </GoogleOAuthProvider>
  );
}
