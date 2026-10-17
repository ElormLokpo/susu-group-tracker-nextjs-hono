"use client";
import { useSendEmailVerification } from "@/app/hooks";
import { useAuthStore } from "../store";
import { EmailType } from "../types";

export const VerifyEmailComponent = () => {
  const { mutate, isPending } = useSendEmailVerification();
  const email = useAuthStore((state) => state.user?.email);

  const handleResendEmail = () => {
    mutate({ email } as EmailType);
  };

  return (
    <div className="bg-[#5200FF] w-full py-5 text-xs flex items-center  justify-center px-3 text-white">
      <span className="flex items-center gap-2">
        You have not verified your email address. Please click this link to
        resend verification code :
        <button
          disabled={isPending}
          className="text-stone-300 underline hover:text-stone-100 hover:cursor-pointer"
          onClick={handleResendEmail}
        >
          {isPending ? "Resending..." : "Resend Verification Code"}
        </button>
      </span>
    </div>
  );
};
