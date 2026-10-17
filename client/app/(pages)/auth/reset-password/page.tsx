"use client";
import { Input } from "@/app/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useResetPassword } from "@/app/hooks";
import { useEffect } from "react";
import { CLIENT_ROUTES } from "@/app/constants";

export const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center h-screen py-10 px-3">
      <div className="w-130">

        <div className="px-16 mb-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") as string;
  const email = searchParams.get("email") as string;


  const { mutate, isPending, isSuccess } = useResetPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    mutate({ newPassword: data.password, email, token });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (!token || !email) return router.push(CLIENT_ROUTES.auth);


  }, [token, email, isPending, router]);


  return (

    <div className=" w-full ">

      <div className="">
        <div className="mb-5">
          <div className="font-semibold text-2xl mb-1">Reset password</div>
          <div>Kindly enter new password to reset your password.</div>
        </div>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input<ResetPasswordValues>
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

        <Input<ResetPasswordValues>
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
          {isPending ? "Resetting password..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
