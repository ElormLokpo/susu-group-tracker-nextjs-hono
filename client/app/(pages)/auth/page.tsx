
"use client";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import Link from "next/link";
import { useGoogleOauth, useLoginUser, useRegisterUser } from "@/app/hooks";
import { useEffect } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";


export default function AuthPage() {
    return (
        <div className="h-screen">
            <AuthForm />
        </div>
    )
}


type OauthResponse = {
    name: string;
    email: string;
    email_verified: boolean;
};

export const AuthForm = () => {
    const [currentForm, setCurrentForm] = useState<string>("signUp");

    const { mutate: googleOauthLogin } = useGoogleOauth();

    const handleOAuth = async (response: CredentialResponse) => {
        const credential = response.credential;
        const { name, email, email_verified } = jwtDecode(
            credential as string,
        ) as OauthResponse;

        if (!credential) return;

        await googleOauthLogin({ name, email, email_verified });
    };

    return (
        <div className="  h-full py-10 flex justify-center items-center">
            <div className="w-130">

                <div className="px-5 md:px-16 mb-4">
                    {currentForm == "signUp" ? <SignUpForm /> : <SignInForm />}
                </div>

                <div className="px-5 md:px-16 mb-4">
                    <GoogleLogin
                        onSuccess={handleOAuth}
                        onError={() => toast.error("Google login failed. Tyy again later")}
                    />
                </div>

                <div className="flex justify-center items-center">
                    {currentForm == "signUp" ? (
                        <span className="text-xs">
                            Already have an account?{" "}
                            <span
                                className="underline hover:cursor-pointer"
                                onClick={() => setCurrentForm("signIn")}
                            >
                                Sign In
                            </span>
                        </span>
                    ) : (
                        <span className="text-xs">
                            Dont have a account?{" "}
                            <span
                                className="underline hover:cursor-pointer"
                                onClick={() => setCurrentForm("signUp")}
                            >
                                Sign Up
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const signUpSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(20, "Name must not exceed 20 characters"),
        email: z.email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
    const { mutate, isPending, isSuccess, isError } = useRegisterUser();

    const {
        register,
        handleSubmit,
        reset,

        setError,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        const { confirmPassword, ...rest } = data;
        void confirmPassword;

        const finalData = { ...rest, role: "user" };
        mutate(finalData);
    };

    useEffect(() => {
        if (isError) {
            setError("email", {
                type: "manual",
                message: " ",
            });

            setError("name", {
                type: "manual",
                message: " ",
            });

            setError("confirmPassword", {
                type: "manual",
                message: " ",
            });

            setError("password", {
                type: "manual",
                message: "Invalid credentials.",
            });
        }
    }, [isError, setError]);

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    return (
        <div className=" w-full ">
            <div className="mb-5">
                <div className="font-semibold text-2xl mb-1">Create an account</div>
                <div>Kindly enter your details below to create an account with us.</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input<SignUpFormValues>
                    name="name"
                    label="Full Name:"

                    register={register}
                    errors={errors}
                />

                <Input<SignUpFormValues>
                    name="email"
                    type="email"
                    label="Email Address:"
                    placeholder="kofi@gmail.com"
                    register={register}
                    errors={errors}
                />

                <Input<SignUpFormValues>
                    name="password"
                    type="password"
                    label="Password:"
                    placeholder="Enter password"
                    register={register}
                    errors={errors}
                />

                <div className="text-xs mb-5">
                    Password must be at least 8 characaters and contain at least one
                    uppercase letter and a number
                </div>

                <Input<SignUpFormValues>
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password:"
                    placeholder="Confirm password"
                    register={register}
                    errors={errors}
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
                >
                    {isPending ? "Creating Account..." : "Create Account"}
                </button>
            </form>
        </div>
    );
};

const signInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
    const { mutate, isPending, isSuccess, isError } = useLoginUser();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignInFormValues) => {
        mutate(data);
    };

    useEffect(() => {
        if (isError) {
            setError("email", {
                type: "manual",
                message: " ",
            });

            setError("password", {
                type: "manual",
                message: "Invalid credentials.",
            });
        }
    }, [isError, setError]);

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    return (
        <div className=" w-full ">
            <div className="mb-5">
                <div className="font-semibold text-2xl mb-1">Log into your account</div>
                <div>Kindly enter your details below to log into your account with us.</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input<SignInFormValues>
                    name="email"
                    type="email"
                    label="Email Address:"
                    placeholder="kofi@gmail.com"
                    register={register}
                    errors={errors}
                />

                <Input<SignInFormValues>
                    name="password"
                    type="password"
                    label="Password:"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                />

                <div className="text-right">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
                >
                    {isPending ? "Logging you in..." : "Log In"}
                </button>
            </form>
        </div>
    );
};