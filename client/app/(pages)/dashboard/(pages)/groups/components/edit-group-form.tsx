import { Dispatch, SetStateAction, useEffect } from "react";
import { LuLoaderCircle, LuX } from "react-icons/lu";
import { UpdateGroupInput } from "./groups-table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { useEditGroup } from "@/app/hooks/groupsHook";

export type GroupStatus = "pending" | "active" | "completed";


export interface GroupFormValues {
    id: string;
    name: string;
    weeklyAmount: string;
    currency: string;
    status: GroupStatus;
    currentWeek: string;
}

export interface Group {
    id: string;
    name: string;
    weeklyAmount: string;
    currency: string;
    status: GroupStatus;
    currentWeek: number;
    inviteLink: string;
    createdBy: string;
    createdAt: string;
}





const editGroupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    weeklyContribution: z
        .string()
        .refine(
            (value) => value.trim() !== "" && !isNaN(Number(value)),
            "Weekly amount must be a valid number"
        )
        .refine(
            (value) => Number(value) >= 50,
            "Weekly amount must be at least 50 GHS"
        ),

    currency: z.string(),
    status: z.enum(["pending", "active", "completed"]),
    currentWeek: z
        .string()
        .refine(
            (value) => value.trim() !== "" && !isNaN(Number(value)),
            "Current week must be a valid number"
        )
})


type EditGroupType = z.infer<typeof editGroupSchema>;


export const EditGroupForm = ({ setIsEditing,  form }: { setIsEditing: Dispatch<SetStateAction<boolean>>, onUpdate?: (id: string, values: UpdateGroupInput) => Promise<void>; form: GroupFormValues }) => {
    const [statusForm, setStatusForm] = useState<GroupStatus>(form.status);
    const { register, handleSubmit, formState: { errors } } = useForm<EditGroupType>({
        resolver: zodResolver(editGroupSchema),
        defaultValues: {
            name: form.name,
            weeklyContribution: form.weeklyAmount,
            currency: form.currency,
            status: form.status,
            currentWeek: form.currentWeek,
        }
    })

    const { mutate: editGroup, isPending, isSuccess } = useEditGroup(form.id);


    const onSubmit = async (data: EditGroupType) => {
        const { status, ...formData } = data;
        void status;

        const finalData = {
            ...formData,
            status: statusForm,
        }

        editGroup(finalData);

    };

    useEffect(() => {
        if (isSuccess) {
            setIsEditing(false);
        }


    }, [isSuccess, setIsEditing]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <form onSubmit={handleSubmit(onSubmit)}>
                <button
                    type="button"
                    aria-label="Close edit panel"
                    onClick={() => !isPending && setIsEditing(false)}
                    className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]"
                />
                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-group-title"
                    className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
                >
                    <div className="flex items-start justify-between border-b border-stone-100 p-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                Group details
                            </p>
                            <h2 id="edit-group-title" className="mt-1 text-xl font-semibold">
                                Edit savings group
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                                Update the group settings below.
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Close"
                            disabled={isPending}
                            onClick={() => setIsEditing(false)}
                        >
                            <LuX size={20} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto p-6">


                        <label className="block space-y-2">
                            <Input<EditGroupType>
                                register={register}
                                errors={errors}
                                name="name"
                                label="Group name:"
                                placeholder="e.g. Family Susu"
                            />
                        </label>

                        <label className="block space-y-2">
                            <Input<EditGroupType>
                                register={register}
                                errors={errors}
                                name="weeklyContribution"
                                label="Weekly contribution:"
                                inputMode="decimal"
                                placeholder="50.00"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block space-y-2">
                                <Input<EditGroupType>
                                    register={register}
                                    errors={errors}
                                    name="currency"
                                    label="Currency:"
                                    placeholder="e.g. USD"
                                    maxLength={3}
                                />
                            </label>
                            <label className="block space-y-2">
                                <Input<EditGroupType>
                                    errors={errors}
                                    register={register}
                                    name="currentWeek"
                                    label="Current week:"
                                    type="number"
                                    min="1"
                                    max="4"
                                    step="1"

                                />
                            </label>
                        </div>

                        <label className="block space-y-2">
                            <span className="text-xs font-medium">Status</span>
                            <select
                                value={statusForm}
                                onChange={(e) => setStatusForm(e.target.value as GroupStatus)}

                                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-indigo-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>


                    </div>

                    <div className="flex gap-3 border-t border-stone-100 p-6">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setIsEditing(false)}
                            className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending }

                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending && <LuLoaderCircle className="animate-spin" size={16} />}
                            {isPending ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </aside>
            </form>
        </div>
    )
}