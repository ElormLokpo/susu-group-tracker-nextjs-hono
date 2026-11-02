"use client"

import { useGetTransactions } from "@/app/hooks/transactionsHook";

import TransactionsTable, {
} from "./components/transactions-table";

import { PiChartLineUp } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";


// const initialTransactions: Transaction[] = [
//     {
//         amount: "50.00",
//         currency: "GHS",
//         groupId: "887329f2-cdcc-4585-92dc-919e16863aac",
//         groupName: "Friday Susu",
//         id: "d1de9619-0240-4b0b-8243-f5bdd99106be",
//         recordedBy: "1eefce64-eae8-47cc-9354-cff84e36e3f9",
//         recorderName: "Ama Mensah",
//         type: "contribution",
//         userId: "1eefce64-eae8-47cc-9354-cff84e36e3f9",
//         userName: "Ama Mensah",
//         week: 1,
//     },
// ];


export default function TransactionsPage() {

    const currentUserRole: string = "admin";

    // const [transactions, setTransactions] = useState(initialTransactions);


    const { data: transactions = [] } = useGetTransactions();

   

    return (
        <div >
            <div >

                <div className="lg:grid grid-cols-10 gap-3">
                    <div className="mb-5 lg:mb-0 col-span-7 ">

                        <div className="mx-auto max-w-7xl space-y-6 h-full">

                            <TransactionsTable
                                data={transactions}
                                // onUpdate={async (id, values) => {

                                    // setTransactions((current) =>
                                    //     current.map((transaction) =>
                                    //         transaction.id === id
                                    //             ? { ...transaction, ...values }
                                    //             : transaction
                                    //     )
                                    // );
                                // }}
                                // onDelete={async (id) => {

                                    // setTransactions((current) =>
                                    //     current.filter((transaction) => transaction.id !== id)
                                    // );
                                // }}
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



