"use client"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { CLIENT_ROUTES } from "@/app/constants";
import Link from "next/link";
import {  useState } from "react";
import { LuCopy } from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useCreateGroup } from "@/app/hooks/groupsHook";

const createGroupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    weeklyAmount: z
        .string()
        .refine(
            (value) => value.trim() !== "" && !isNaN(Number(value)),
            "Weekly amount must be a valid number"
        )
        .refine(
            (value) => Number(value) >= 50,
            "Weekly amount must be at least 50 GHS"
        ),

    maxNumberOfMembers: z
        .string()
        .refine(
            (value) => value.trim() !== "" && !isNaN(Number(value)),
            "Maximum number of members must be a valid number"
        )
        .refine(
            (value) =>
                Number.isInteger(Number(value)) &&
                Number(value) >= 2 &&
                Number(value) <= 5,
            "Maximum number of members must be between 2 and 5"
        ),
});

const joinGroupSchema = z.object({
    link: z.string().min(3, "Group link must follow particular format"),

});


const isPending = false;


export type CreateGroupValues = z.infer<typeof createGroupSchema>;
type JoinGroupValues = z.infer<typeof joinGroupSchema>;

export const InitiateUserPage = () => {
    const [currentForm, setCurrentForm] = useState<string>("create");


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
                {
                    currentForm == "create" ? <CreateGroupForm setCurrentForm={setCurrentForm} /> : <JoinGroupForm setCurrentForm={setCurrentForm} />
                }
            </div>
        </div>

    )
}

const JoinGroupForm = ({ setCurrentForm }: { setCurrentForm: (form: string) => void }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JoinGroupValues>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            link: "",
        },
    });


    const onSubmit = async (data: JoinGroupValues) => {
        console.log(data)

    };

    return (
        <div className=" bg-white shadow-xl border border-stone-200  p-5 rounded-2xl">

            <div className="">
                <div className="mb-5">
                    <div className="font-semibold text-xl mb-1">Join your savings group</div>
                    <div>Kindly enter the group link of your savings group below.</div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input<JoinGroupValues>
                    name="link"
                    type="text"
                    label="Grou Link:"
                    placeholder="Enter group invite link"
                    register={register}
                    errors={errors}
                />



                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
                >
                    {isPending ? "Joining group..." : "Join group"}
                </button>

                <div className="w-full flex justify-center items-center mt-2 text-xs underline text-gray-500">
                    <button onClick={() => setCurrentForm("create")} className="underline hover:cursor-pointer">I want to create my own group</button>
                </div>
            </form>
        </div>
    )

}


const CreateGroupForm = ({ setCurrentForm }: { setCurrentForm: (form: string) => void }) => {

    const { data, mutate: createGroup, isPending, isSuccess } = useCreateGroup();



    const {
        register,
        handleSubmit,
       
        formState: { errors },
    } = useForm<CreateGroupValues>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            weeklyAmount: "50",
            maxNumberOfMembers: "2"
        },
    });


    const onSubmit = async (data: CreateGroupValues) => {
        console.log(data);
        const finalData = {
            ...data,
            weeklyAmount: Number(data.weeklyAmount),
            maxNumberOfMembers: Number(data.maxNumberOfMembers)
        }
        createGroup(finalData);

    };

    return (
        isSuccess ? <div>
            <InviteMembersForm inviteId={data.data.inviteLink} />
        </div> :
            <div className=" bg-white shadow-xl border border-stone-200  p-5 rounded-2xl">

                <div className="">
                    <div className="mb-5">
                        <div className="font-semibold text-xl mb-1">Create your savings group</div>
                        <div>Kindly enter the group name, and weekly contribution amount.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <Input<CreateGroupValues>
                        name="name"
                        type="text"
                        label="Name:"
                        placeholder="Enter the name of your group"
                        register={register}
                        errors={errors}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input<CreateGroupValues>
                            name="weeklyAmount"
                            type="number"
                            min={50}
                            label="Weekly amount:"
                            placeholder="Enter weekly savings amount in cedis"
                            register={register}
                            errors={errors}
                        />


                        <Input<CreateGroupValues>
                            name="maxNumberOfMembers"
                            type="number"
                            min={2}
                            max={5}
                            label="Maximum number of members:"
                            placeholder="Enter maximum number of members"
                            register={register}
                            errors={errors}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
                    >
                        {isPending ? "Creating group..." : "Create group"}
                    </button>

                    <div className="w-full flex justify-center items-center mt-2 text-xs underline text-gray-500">
                        <button onClick={() => setCurrentForm("join")} className="underline hover:cursor-pointer">I already have a group to join</button>
                    </div>
                </form>
            </div>
    )
}


const InviteMembersForm = ({ inviteId }: { inviteId: string }) => {
    const [copied, setCopied] = useState(false);
    const value = process.env.NEXT_PUBLIC_ENVIRONMENT === "produciton" ? process.env.NEXT_PUBLIC_CLIENT + "/invite/" + inviteId : process.env.NEXT_PUBLIC_CLIENT_LOCAL + "/invite/" + inviteId;
    const placeholder = "Copy link";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy link:", error);
        }
    };


    return (
        <div className=" bg-white shadow-xl border border-stone-200  p-5 rounded-2xl">

            <div className="">
                <div className="mb-5">
                    <div className="font-semibold text-xl mb-1">Invite members to your group</div>
                    <div className="text-sm">Copy the link below and send it to your friends to invite them to your group.</div>
                </div>
            </div>

            <form className="space-y-4" noValidate>
                <div className="flex w-full items-center gap-2 mb-10">
                    <input
                        type="text"
                        value={value}
                        readOnly
                        placeholder={placeholder}
                        aria-label="Link to copy"
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
                    />

                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={copied ? "Copied" : "Copy link"}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-stone-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        {copied ? (
                            <>
                                <IoCheckmarkCircleOutline size={16} />
                                Copied
                            </>
                        ) : (
                            <>
                                <LuCopy size={16} />
                                Copy
                            </>
                        )}
                    </button>
                </div>



                <Link href={CLIENT_ROUTES.dashboard}
                    className="mt-2 w-full rounded-md bg-lime-500 hover:bg-lime-600 px-4 py-3.5 font-polysans text-sm  text-white font-semibold transition-colors focus:outline-none disabled:opacity-50"
                >
                    {"Continue to dashboard"}
                </Link>


            </form>
        </div>
    )
}



export default InitiateUserPage;