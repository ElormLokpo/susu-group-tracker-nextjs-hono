"use client";
import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import { useAuthStore } from "../store";
import { VerifyEmailComponent } from "../components/verifyEmail";
import GoogleProvider from "./google-provider";

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return (
    <>
      <QueryProvider>
        <GoogleProvider>
          {user?.isEmailVerified || !token ? "" : <VerifyEmailComponent />}
          {children}
          <Toaster />
        </GoogleProvider>
      </QueryProvider>
    </>
  );
};
