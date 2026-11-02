
"use client";

import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import GoogleProvider from "./google-provider";
import { useAuthStore } from "../store";
import { VerifyEmailComponent } from "../components/verifyEmail";

export const RootProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return (
    <QueryProvider>
      <GoogleProvider>
        {user?.isEmailVerified || !token ? null : (
          <VerifyEmailComponent />
        )}

        {children}

        <Toaster />
      </GoogleProvider>
    </QueryProvider>
  );
};
