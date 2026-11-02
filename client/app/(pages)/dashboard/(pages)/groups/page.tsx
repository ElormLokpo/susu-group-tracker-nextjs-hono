"use client";
import { IoWalletOutline } from "react-icons/io5";
import GroupsTable, { UpdateGroupInput } from "./components/groups-table";
import { PiChartLineUp } from "react-icons/pi";
import { useGetGroups } from "@/app/hooks/groupsHook";

export default function GroupsPage() {
    const currentUserRole: string = "admin";

    const {
        data: groups = [],
        isLoading,
        error,
        refetch
    } = useGetGroups();



    const handleUpdateGroup = async (
        id: string,
        values: UpdateGroupInput
    ) => {
        void id;
        void values;

    };

    const handleDeleteGroup = async (id: string) => {


    };

    return (
        <div >
            <div >

                <div className="lg:grid grid-cols-10 gap-3">
                    <div className="mb-5 lg:mb-0 col-span-7 ">

                        <div className="mx-auto max-w-7xl space-y-6 h-full">
                            <GroupsTable
                                data={groups}
                                isLoading={isLoading}
                                error={error instanceof Error ? error.message : null}
                                onRetry={() => void refetch()}

                                onUpdate={handleUpdateGroup}
                                onDelete={handleDeleteGroup}
                            />
                        </div>
                    </div>

                    <div className="col-span-3 ">
                        <div className="lg:grid lg:grid-cols-2 gap-3 lg:h-30 mb-5 lg:mb-3">
                            <div className="bg-white rounded-2xl flex flex-col justify-between p-4 mb-3 lg:mb-0 h-25 lg:h-full">

                                <div className="flex justify-between items-center ">
                                    <div className="flex gap-2 items-center text-sm">
                                        <span> <IoWalletOutline /></span>
                                        <span>Total Balance</span>
                                    </div>

                                    <div className="flex gap-2 items-center">

                                    </div>
                                </div>


                                <div>
                                    <div className="text-[25px] tracking-[-2px]">
                                        GHS 123,455.00
                                    </div>

                                    <div className="text-xs flex items-center gap-1">
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full bg-indigo-500 text-white" : "bg-lime-500  text-white"}`}>
                                            <PiChartLineUp />
                                        </span>
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full text-indigo-500" : "text-lime-500"}`}>+12.00%</span>
                                        <span>vs last week</span>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-2xl flex flex-col justify-between p-4 mb-3 lg:mb-0 h-25 lg:h-full">

                                <div className="flex justify-between items-center ">
                                    <div className="flex gap-2 items-center text-sm">
                                        <span> <IoWalletOutline /></span>
                                        <span>Total Balance</span>
                                    </div>

                                    <div className="flex gap-2 items-center">

                                    </div>
                                </div>


                                <div>
                                    <div className="text-[25px] tracking-[-2px]">
                                        GHS 123,455.00
                                    </div>

                                    <div className="text-xs flex items-center gap-1">
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full bg-indigo-500 text-white" : "bg-lime-500  text-white"}`}>
                                            <PiChartLineUp />
                                        </span>
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full text-indigo-500" : "text-lime-500"}`}>+12.00%</span>
                                        <span>vs last week</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="lg:grid lg:grid-cols-2 gap-3 lg:h-50 mb-3 ">
                            <div className="bg-white rounded-2xl flex flex-col justify-between p-4 mb-3 lg:mb-0 h-25 lg:h-full">

                                <div className="flex justify-between items-center ">
                                    <div className="flex gap-2 items-center text-sm">
                                        <span> <IoWalletOutline /></span>
                                        <span>Total Balance</span>
                                    </div>

                                    <div className="flex gap-2 items-center">

                                    </div>
                                </div>


                                <div>
                                    <div className="text-[25px] tracking-[-2px]">
                                        GHS 123,455.00
                                    </div>

                                    <div className="text-xs flex items-center gap-1">
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full bg-indigo-500 text-white" : "bg-lime-500  text-white"}`}>
                                            <PiChartLineUp />
                                        </span>
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full text-indigo-500" : "text-lime-500"}`}>+12.00%</span>
                                        <span>vs last week</span>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-2xl flex flex-col justify-between p-4 mb-3 lg:mb-0 h-25 lg:h-full">

                                <div className="flex justify-between items-center ">
                                    <div className="flex gap-2 items-center text-sm">
                                        <span> <IoWalletOutline /></span>
                                        <span>Total Balance</span>
                                    </div>

                                    <div className="flex gap-2 items-center">

                                    </div>
                                </div>


                                <div>
                                    <div className="text-[25px] tracking-[-2px]">
                                        GHS 123,455.00
                                    </div>

                                    <div className="text-xs flex items-center gap-1">
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full bg-indigo-500 text-white" : "bg-lime-500  text-white"}`}>
                                            <PiChartLineUp />
                                        </span>
                                        <span className={`${currentUserRole == "admin" ? "p-1 rounded-full text-indigo-500" : "text-lime-500"}`}>+12.00%</span>
                                        <span>vs last week</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 h-50 lg:h-77 bg-stone-900 text-stone-100 rounded-2xl p-4 mb-3">
                            a
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}