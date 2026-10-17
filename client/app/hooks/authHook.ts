"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import {
  AuthResponseType,
  EmailType,
  LoginUserRequest,
  OauthRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyUserResponseType,
} from "../types";
import { API_ROUTES, CLIENT_ROUTES } from "../constants";
import { toast } from "sonner";
import { useAuthStore } from "../store";
import { useRouter } from "next/navigation";

export const useRegisterUser = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterUserRequest): Promise<AuthResponseType> =>
      api.post(API_ROUTES.register, data),
    onSuccess: (data: AuthResponseType) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully");
      router.push(CLIENT_ROUTES.verifyEmail);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useVerifyEmail = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (
      data: VerifyEmailRequest,
    ): Promise<VerifyUserResponseType> =>
      api.post(API_ROUTES.verifyEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      toast.success("Email verified successfully");
      setAuth(data.user, token as string);
      router.push(CLIENT_ROUTES.home);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useLoginUser = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginUserRequest): Promise<AuthResponseType> =>
      api
        .post(API_ROUTES.login, data)
        .then((data) => data) as Promise<AuthResponseType>,
    onSuccess: (data: AuthResponseType) => {
      toast.success("Logged in successfully");

      setAuth(data.user, data.token);
      router.push(CLIENT_ROUTES.home);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: EmailType) =>
      api.post(API_ROUTES.forgotPassword, data).then((data) => data),
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) =>
      api.post(API_ROUTES.resetPassword, data).then((data) => data),
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push(CLIENT_ROUTES.auth);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useSendEmailVerification = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async (data: EmailType) =>
      api
        .post(API_ROUTES.resendVerification, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => data),
    onSuccess: () => {
      toast.success("Verification code sent successfully");
      router.push(CLIENT_ROUTES.verifyEmail);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};

export const useGoogleOauth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: OauthRequest): Promise<AuthResponseType> =>
      api.post(API_ROUTES.googleOauth, data),
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      setAuth(data.user, data.token as string);
      router.push(CLIENT_ROUTES.home);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });
};
