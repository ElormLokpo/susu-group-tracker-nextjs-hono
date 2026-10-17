import { CLIENT_ROUTES } from "@/app/constants"
import { useMemo } from 'react';
import Link from "next/link"
import { RxDashboard } from "react-icons/rx";
import { CiMoneyCheck1 } from "react-icons/ci";
import { RiGroupLine } from "react-icons/ri";
import { LuUserRoundCheck } from "react-icons/lu";
import { TbSettings } from "react-icons/tb";
import { MdNotificationsNone } from "react-icons/md";
import Image from "next/image";
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };






const style = new Style(lorelei);

export function ProfileImage({ seed = 'Alice' }: { seed?: string }) {
    const dataUri = useMemo(
        () =>
            new Avatar(style, {
                seed,
                size: 128,

            }).toDataUri(),
        [seed],
    );

    return <Image src={dataUri} alt="Avatar" width={50} height={50} />;
}

export const DashTopNav = () => {

    const currentUserRole: string = "admin"


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

    return (
        <div className="flex justify-between py-2 mb-5">
            <div className="grid grid-cols-2 gap-2 items-center hover:cursor-pointer ">
                <div>
                    <Link href={CLIENT_ROUTES.dashboard} className={`font-semibold text-lg ${currentUserRole == "admin" ? "text-indigo-500" : "text-green-500"} `}>SuSu</Link>
                </div>

            </div>

            <div className="flex gap-3 ">
                {
                    navLinks.map((navLink, index) => (
                        <Link className={`flex gap-2 items-center  px-5 rounded-full ${navLink.isActive ? "bg-stone-900 hover:bg-stone-700 text-stone-100" : "bg-white hover:bg-stone-200 text-stone-900"} text-xs `} href={navLink.href} key={index} >
                            <span>{navLink.icon}</span>
                            <span>{navLink.name}</span>
                        </Link>
                    ))
                }


            </div>

            <div className="grid grid-cols-3 gap-3 h-10 ">

                <div className="bg-white hover:bg-stone-200 rounded-full px-1 py-1 flex justify-center items-center  text-lg">
                    <Link href={""}><MdNotificationsNone /></Link>
                </div>

                <div className="bg-white hover:bg-stone-200 rounded-full px-2 py-2 flex justify-center items-center  text-lg">
                    <Link href={""}><TbSettings /></Link>
                </div>

                <div>
                    <ProfileImage />
                </div>

            </div>
        </div>
    )
}