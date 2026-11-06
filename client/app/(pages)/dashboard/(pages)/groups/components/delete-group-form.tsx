import { useDeleteGroup } from "@/app/hooks/groupsHook";
import { Dispatch, SetStateAction, useEffect } from "react";
import { LuTrash2, LuLoaderCircle } from "react-icons/lu";
import { Group } from "./groups-table";

export const DeleteGroupForm = ({ setDeleting, deleting }: { setDeleting: Dispatch<SetStateAction<Group | null>>; deleting: Group; }) => {
    const { mutate: deleteGroup, isPending, isSuccess } = useDeleteGroup();

    const handleDelete = () => {
        deleteGroup(deleting.id)
    }

    useEffect(() => {
        if (isSuccess) {
            setDeleting(null)
        }
    }, [isSuccess, setDeleting])

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-[2px]">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-group-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <LuTrash2 size={22} />
                </div>
                <h2 id="delete-group-title" className="text-lg font-semibold">
                    Delete this savings group?
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-stone-800">{deleting.name}</span>?
                    This action cannot be undone.
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setDeleting(null)}
                        className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending && <LuLoaderCircle className="animate-spin" size={16} />}
                        {isPending ? "Deleting..." : "Delete group"}
                    </button>
                </div>
            </div>
        </div>
    )
}