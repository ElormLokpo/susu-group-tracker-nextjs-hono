import { Dispatch, SetStateAction, useEffect } from "react";
import { LuLoaderCircle, LuX } from "react-icons/lu";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { useCreateGroup } from "@/app/hooks/groupsHook";

export type GroupStatus = "pending" | "active" | "completed";


export interface GroupFormValues {
    id: string;
    name: string;
    weeklyAmount: string;
    currency: string;
    status: GroupStatus;
    currentWeek: string;
    maxNumberOfMembers: string;
}

export interface Group {
    id: string;
    name: string;
    weeklyAmount: string;
    currency: string;
    status: GroupStatus;
    currentWeek: number;
    maximumNumberOfMembers: number;
    inviteLink: string;
    createdBy: string;
    createdAt: string;
}





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
    maxNumberOfMembers: z.string()
        .refine(
            (value) => value.trim() !== "" && !isNaN(Number(value)),
            "Maximum number of members must be a valid number"
        ),
    currency: z.string(),

})


type CreateGroupType = z.infer<typeof createGroupSchema>;


export const CreateGroupForm = ({ setIsCreating }: { setIsCreating: Dispatch<SetStateAction<boolean>> }) => {

    const { register, handleSubmit, formState: { errors }, setError } = useForm<CreateGroupType>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            weeklyAmount: "",
            currency: "",
            maxNumberOfMembers: "",
        }
    })

    const { mutate: createGroup, isPending, isSuccess, isError } = useCreateGroup();


    const onSubmit = async (data: CreateGroupType) => {
        const { ...formData } = data;
        void status;

        const finalData = {
            ...formData,
            maxNumberOfMembers: parseInt(formData.maxNumberOfMembers),

            weeklyAmount: parseFloat(formData.weeklyAmount),

        }

        createGroup(finalData);

    };

    useEffect(() => {
        if (isSuccess) {
            setIsCreating(false);
        }


    }, [isSuccess, setIsCreating]);

    useEffect(() => {
        if (isError) {

            setError("name", {
                type: "manual",
                message: " ",
            });

            setError("maxNumberOfMembers", {
                type: "manual",
                message: " ",
            });



            setError("weeklyAmount", {
                type: "manual",
                message: "Error updating group. Please try again",
            });

            setError("currency", {
                type: "manual",
                message: " ",
            });


        }
    }, [isError, setError]);


    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <form onSubmit={handleSubmit(onSubmit)}>
                <button
                    type="button"
                    aria-label="Close create panel"
                    onClick={() => !isPending && setIsCreating(false)}
                    className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]"
                />
                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-group-title"
                    className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
                >
                    <div className="flex items-start justify-between border-b border-stone-100 p-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                Group details
                            </p>
                            <h2 id="create-group-title" className="mt-1 text-xl font-semibold">
                                Create savings group
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                                Update the group settings below.
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Close"
                            disabled={isPending}
                            onClick={() => setIsCreating(false)}
                        >
                            <LuX size={20} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto p-6">


                        <label className="block space-y-2">
                            <Input<CreateGroupType>
                                register={register}
                                errors={errors}
                                name="name"
                                label="Group name:"
                                placeholder="e.g. Family Susu"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block space-y-2">
                                <Input<CreateGroupType>
                                    register={register}
                                    errors={errors}
                                    name="weeklyAmount"
                                    label="Weekly Amount:"
                                    inputMode="decimal"
                                    placeholder="50.00"
                                />
                            </label>

                            <label className="block space-y-2">
                                <Input<CreateGroupType>
                                    register={register}
                                    errors={errors}
                                    name="currency"
                                    label="Currency:"
                                    placeholder="e.g. USD"
                                    maxLength={3}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block space-y-2">
                                <Input<CreateGroupType>
                                    register={register}
                                    errors={errors}
                                    name="maxNumberOfMembers"
                                    label="Maximum number of members:"
                                    type="number"
                                    min="2"
                                    max="5"
                                    step="1"
                                />
                            </label>

                        </div>




                    </div>

                    <div className="flex gap-3 border-t border-stone-100 p-6">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setIsCreating(false)}
                            className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}

                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending && <LuLoaderCircle className="animate-spin" size={16} />}
                            {isPending ? "Creating group..." : "Create group"}
                        </button>
                    </div>
                </aside>
            </form>
        </div>
    )
}