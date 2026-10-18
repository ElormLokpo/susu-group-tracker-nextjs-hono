"use client"
import { RxDashboard } from "react-icons/rx";
import { CiMoneyCheck1 } from "react-icons/ci";
import { RiGroupLine } from "react-icons/ri";
import { LuUserRoundCheck } from "react-icons/lu";
import { CLIENT_ROUTES } from "@/app/constants"
import Link from "next/link";
import { TbSettings } from "react-icons/tb";
import { ProfileImage } from "./dashTopNav";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuthStore } from "@/app/store";
import { useRouter } from "next/navigation";


export default function SideNav() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const currentUserRole: string = user?.role as string;

    const navLinks = currentUserRole == "admin" ?

        [
            { name: "Dashboard", href: CLIENT_ROUTES.dashboard, icon: <RxDashboard />, isActive: true },
            { name: "Transactions", href: CLIENT_ROUTES.dashboardTransactions, icon: <CiMoneyCheck1 /> },

            { name: "Groups", href: CLIENT_ROUTES.dashboardGroups, icon: <RiGroupLine /> },
            { name: "Users", href: CLIENT_ROUTES.dashboardUsers, icon: <LuUserRoundCheck /> },


        ] : [
            { name: "Home", href: CLIENT_ROUTES.dashboard, icon: <RxDashboard />, isActive: true },
            { name: "Transactions", href: CLIENT_ROUTES.dashboardTransactions, icon: <CiMoneyCheck1 /> },

        ]

    const handleLogout = () => {
        clearAuth();
        router.push(CLIENT_ROUTES.auth);
    }


    return (
        <div className="bg-white border-r border-stone-200 hidden lg:block h-screen p-5 lg:p-5 col-span-2">
            <div className="  h-full flex flex-col justify-between">
                <div>
                    <div className="mb-8">
                        <span className={`font-semibold ${currentUserRole == "admin" ? "text-indigo-500" : "text-lime-500"}`}>SuSu</span>
                    </div>

                    <div className=" ">
                        {
                            navLinks.map((navLink, index) => (
                                <Link className={`flex gap-2 items-center mb-2 px-5  rounded-lg py-3 ${navLink.isActive ? "bg-stone-900 hover:bg-stone-700 text-stone-100" : "bg-white hover:bg-stone-200 text-stone-900"} text-sm `} href={navLink.href} key={index} >
                                    <span>{navLink.icon}</span>
                                    <span>{navLink.name}</span>
                                </Link>
                            ))
                        }

                        <Link className={`flex gap-2 items-center hover:bg-stone-100 px-5 mb-2  rounded-lg py-3 text-sm `} href={""}  >
                            <span><TbSettings /></span>
                            <span>Settings</span>
                        </Link>

                    </div>
                </div>

                <div>


                    <div className="flex justify-between items-center">

                        <div className="flex gap-2 p-1 rounded-md">
                            <div>
                                <ProfileImage />
                            </div>

                            <div className="flex flex-col ">
                                <span className="font-semibold">{user?.name}</span>
                                <span className="text-sm">{user?.email}</span>
                            </div>
                        </div>

                        <div>
                            <button onClick={handleLogout} className="hover:bg-stone-100 p-2 rounded-md">
                                <HiOutlineLogout />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}