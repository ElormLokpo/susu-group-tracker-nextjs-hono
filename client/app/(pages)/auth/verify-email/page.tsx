"use client";
import { Input } from "@/app/components/ui/input";
import { useVerifyEmail } from "@/app/hooks";
import { useAuthStore } from "@/app/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";
import Link from "next/link";
import { CLIENT_ROUTES } from "@/app/constants";
import { useRouter } from "next/navigation";

export const VerifyEmailPage = () => {
  return (
    <div className="flex items-center justify-center h-screen py-10 px-3">
      <div className="w-130">

        <div className="px-5 md:px-16 mb-4">
          <VerifyEmailForm />
        </div>
      </div>
    </div>
  );
};

const verifyEmailSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

const VerifyEmailForm = () => {
  const authenticatedUserEmail = useAuthStore((state) => state.user?.email);
  const { mutate, isPending, isSuccess } = useVerifyEmail();
  const router = useRouter()


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyEmailValues) => {
    const findalData = { email: authenticatedUserEmail, code: data.code };
    mutate(findalData);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (!authenticatedUserEmail) router.push(CLIENT_ROUTES.auth)

  }, [router, authenticatedUserEmail])

  return (
    <div className=" w-full ">

      <div className="">
        <div className="mb-5">
          <div className="font-semibold text-2xl mb-1">Verify Your Email</div>
          <div>Kindly enter the code sent to your email to verify your email address.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input<VerifyEmailValues>
          name="code"
          type="number"
          label="Code:"
          placeholder="Enter code sent to your email"
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
        >
          {isPending ? "Verifying email..." : "Verify Email"}
        </button>

        <div className="w-full flex justify-center items-center mt-2 text-xs underline text-gray-500">
          <Link href={CLIENT_ROUTES.dashboard}>Skip for now</Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
