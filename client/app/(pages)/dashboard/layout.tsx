"use client"
import { Suspense } from "react";
import { DashTopNav } from "./components/dash-top-nav";
import DatePickerDashboard from "./components/date-picker";
import { getPageHeader } from "./helpers";
import { usePathname } from "next/navigation";
import SideNav from "./components/side-nav";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
   

    const urlSegments = pathname.split("/").filter(Boolean);
    const currentPage = urlSegments[1] || urlSegments[0] || "dashboard";

    const currentUserRole: string = "admin";

    const showRightNav = false
    const { title, description } = getPageHeader(currentPage, currentUserRole)

   

    return (
        <Suspense>
            <div className="grid grid-cols-12 h-full">
                <div className="col-span-2">
                    <SideNav />
                </div>



                <div className={`${showRightNav && "grid grid-cols-12 gap-2"} bg-stone-100 col-span-10`}>
                    <div className="h-full  col-span-10">
                        <div className="hidden lg:block">
                            <DashTopNav  currentPage={"Dashboard"} />
                        </div>

                        <div className="p-5">
                            <div>
                                <div className="md:flex md:justify-between mb-15">
                                    <div className="flex flex-col mb-5 md:mb-0">
                                        <span className="text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]"> {title}</span>
                                        <span className=" text-xs md:text-sm xl:text-[16px]">{description}</span>
                                    </div>

                                    <div className={`${currentUserRole == "user" && " flex gap-2"}`}>
                                        <DatePickerDashboard />

                                        {currentUserRole == "user" && <div className="flex gap-3 items-center">
                                            <button className="text-sm bg-lime-500 py-2 px-3 text-white hover:bg-lime-600  rounded-full">Make Payment</button>
                                        </div>}
                                    </div>
                                </div>

                            </div>

                            {children}
                        </div>
                    </div>
                    {showRightNav && <div className="col-span-2 bg-white p-2 rounded-2xl">
                        b
                    </div>}

                </div>
            </div>

        </Suspense>

    )
}



