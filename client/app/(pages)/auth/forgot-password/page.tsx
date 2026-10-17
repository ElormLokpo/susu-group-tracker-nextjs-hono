"use client";
import { Input } from "@/app/components/ui/input";

import { useForgotPassword } from "@/app/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";

export const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center h-screen py-10 px-3">
      <div className="w-130">

        <div className="px-5 md:px-16 mb-4">
          <ForgotPasswordForm />
        </div>
      </div>

    </div>
  );
};

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <div className=" w-full ">

      <div className="">
        <div className="mb-5">
          <div className="font-semibold text-2xl mb-1">Forgot Your Password?</div>
          <div>Kindly enter your account email address below to reset your password.</div>
        </div>
      </div>

      {isSuccess ?? (
        <div className="w-full flex justify-center items-center py-5">
          A password reset link has been to your email.

        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input<ForgotPasswordValues>
          name="email"
          type="email"
          label="Email Address:"
          placeholder="kofi@gmail.com"
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
        >
          {isPending ? "Sending resend code..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
