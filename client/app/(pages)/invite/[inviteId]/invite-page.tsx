"use client"
import { Input } from "@/app/components/ui/input";
import { CLIENT_ROUTES } from "@/app/constants";
import { useJoinGroup } from "@/app/hooks/groupsHook";
import { useAuthStore } from "@/app/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";




const joinGroupSchema = z
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

type JoinGroupFormValues = z.infer<typeof joinGroupSchema>;

interface Props {
    inviteId: string;
}

export const InvitePage = ({ inviteId }: Props) => {
    
    const userRole = useAuthStore((state) => state.user?.role);

    const { mutate: joinGroup, isPending, isSuccess, isError } = useJoinGroup();

    const {
        register,
        handleSubmit,
        reset,

        setError,
        formState: { errors },
    } = useForm<JoinGroupFormValues>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


    const onSubmit = async (data: JoinGroupFormValues) => {
        const { confirmPassword, ...rest } = data;
        void confirmPassword;

        const finalData = { ...rest, role: userRole as  "member" | "admin", inviteId: inviteId as string };

       
        joinGroup(finalData);
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
        <div className="grid grid-cols-2">
            <div
                className="bg-contain bg-center bg-no-repeat "
                style={{ backgroundImage: "url(/savings.jpg)" }}
            >
                <div className="h-full  text-stone-100 rounded-3xl flex flex-col justify-between">
                    <div className="p-10 ">
                        <Link href={CLIENT_ROUTES.home} className="text-lime-500 font-semibold text-xl hover:underline">SuSu</Link>
                    </div>


                </div>

            </div>

            <div className="h-screen bg-white flex justify-center items-center">
                <div className=" bg-white shadow-xl border border-stone-200  p-5 rounded-2xl">
                    <div className="mb-5">
                        <div className="font-semibold text-xl mb-1">Join your savings group</div>
                        <div className="text-sm">You have been invited to join a savings group. Kindly enter your details below to join the group.</div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        <Input<JoinGroupFormValues>
                            name="name"
                            label="Full Name:"

                            register={register}
                            errors={errors}
                        />

                        <Input<JoinGroupFormValues>
                            name="email"
                            type="email"
                            label="Email Address:"
                            placeholder="kofi@gmail.com"
                            register={register}
                            errors={errors}
                        />

                        <Input<JoinGroupFormValues>
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

                        <Input<JoinGroupFormValues>
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
                            {isPending ? "Joining Group..." : "Join Group"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default InvitePage;