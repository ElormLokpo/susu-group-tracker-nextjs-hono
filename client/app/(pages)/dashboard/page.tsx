import { IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { PiChartLineUp } from "react-icons/pi";

export const DashboardPage = () => {
    const currentUserRole: string = "admin";

    return (
        <div >
            <div >

                <div className="lg:grid grid-cols-2 gap-3">
                    <div className="mb-5 lg:mb-0">
                        <div className="bg-white p-5 flex flex-col justify-between rounded-2xl mb-3 h-50 lg:h-60">
                            <div className="flex justify-between items-center ">
                                <div className="flex gap-2 items-center text-sm">
                                    <span> <IoWalletOutline /></span>
                                    <span>Total Balance</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <span className=""><Image className="" width={20} height={40} src="/gh.jpg" alt="GHS" /></span>
                                    <span className="text-xs">GHS</span>
                                </div>
                            </div>


                            <div>
                                <div className="text-[40px] tracking-[-2px]">
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

                            <div className="grid grid-cols-5 gap-2">
                                <div className="w-full bg-stone-900 text-white flex gap-2 items-center rounded-full px-3 py-3 justify-center">
                                    <span><IoWalletOutline /></span>
                                    <span className="text-xs">Receive Money</span>
                                </div>

                                <div className="w-full bg-stone-100 text-stone-900 flex gap-2 items-center rounded-full px-3 py-3 justify-center">
                                    <span><IoWalletOutline /></span>
                                    <span className="text-xs">Receive Money</span>
                                </div>


                            </div>

                        </div>

                        <div className="bg-white rounded-2xl h-50 lg:h-100 p-5">
                            <div>
                                <div className="flex justify-between items-center ">
                                    <div className="flex gap-2 items-center text-sm">
                                        <span> <IoWalletOutline /></span>
                                        <span>Total Balance</span>
                                    </div>

                                    <div className="flex gap-2 items-center">

                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
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


                    </div>

                    <div>
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
                            <div className="bg-white flex flex-col justify-between rounded-2xl p-4 mb-3 lg:mb-0 h-25 lg:h-full">
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

                                <div>
                                    <div className="grid grid-cols-10">
                                        <span className=" col-span-4 rouned-l-full text-center text-xs py-2 text-indigo-500">
                                            40%
                                        </span>
                                        <span className="col-span-3 text-center text-xs py-2 text-lime-500">
                                            30%
                                        </span>
                                        <span className="col-span-3 rounded-r-full text-center text-xs py-2">
                                            30%
                                        </span>
                                    </div>


                                    <div className="grid grid-cols-10">
                                        <span className="border-2 border-indigo-500 col-span-4 rouned-l-full"></span>
                                        <span className="border-2 border-lime-500 col-span-3"></span>
                                        <span className="border-2 border-black-500 col-span-3 rounded-r-full"></span>
                                    </div>
                                    <div className="grid grid-cols-10">
                                        <span className=" col-span-4 rouned-l-full text-center text-xs py-2 text-indigo-500">
                                            Income
                                        </span>
                                        <span className="col-span-3 text-center text-xs py-2 text-lime-500">
                                            Expenses
                                        </span>
                                        <span className="col-span-3 rounded-r-full text-center text-xs py-2">
                                            Savings
                                        </span>
                                    </div>
                                </div>


                            </div>


                            <div className={`${currentUserRole == "admin" ? "bg-indigo-500" : "bg-lime-500"} flex flex-col justify-between text-white rounded-2xl p-4 h-25 lg:h-full`}>
                                <div className="font-semibold">
                                    Financial Report
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="border-l border-white px-2">
                                        <div className="text-xs">Salary</div>
                                        <div>GHS 4,500</div>
                                    </div>

                                    <div className="border-l border-white px-2">
                                        <div className="text-xs">Salary</div>
                                        <div>GHS 4,500</div>
                                    </div>

                                    <div className="border-l border-white px-2">
                                        <div className="text-xs">Salary</div>
                                        <div>GHS 4,500</div>
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


        </div >
    )
}


export default DashboardPage;