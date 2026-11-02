import { Dispatch, SetStateAction } from "react";
import { LuLoaderCircle, LuX } from "react-icons/lu";
import { UpdateGroupInput } from "./groups-table";


export type GroupStatus = "pending" | "active" | "completed";


export interface GroupFormValues {
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


const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-500";



export const EditGroupForm = ({ group, setEditing, saving, onUpdate }: { group: Group, setEditing: Dispatch<SetStateAction<Group | null>>, saving: boolean, onUpdate?: (id: string, values: UpdateGroupInput) => Promise<void>; }) => {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button
                type="button"
                aria-label="Close edit panel"
                onClick={() => !saving && setEditing(null)}
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
                        disabled={saving}
                        onClick={() => setEditing(null)}
                        className="rounded-xl p-2 text-stone-500 hover:bg-stone-100"
                    >
                        <LuX size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto p-6">


                    <label className="block space-y-2">
                        <span className="text-sm font-medium">Group name</span>
                        <input
                            value={group.name}
                            className={inputClass.replace("pl-10", "pl-3")}
                            placeholder="e.g. Family Susu"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">Weekly contribution</span>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={group.weeklyAmount}
                            className={inputClass.replace("pl-10", "pl-3")}
                            placeholder="50.00"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Currency</span>
                            <input
                                value={group.currency}
                                maxLength={3}
                                className={inputClass.replace("pl-10", "pl-3")}
                            />
                        </label>
                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Current week</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={group.currentWeek}
                                className={inputClass.replace("pl-10", "pl-3")}
                            />
                        </label>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">Status</span>
                        <select
                            value={group.status}
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
                        disabled={saving}
                        onClick={() => setEditing(null)}
                        className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={saving || !onUpdate}
                       
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving && <LuLoaderCircle className="animate-spin" size={16} />}
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </aside>
        </div>
    )
}