"use client"
import { Suspense } from "react";
import { DashTopNav } from "./components/dashTopNav";
import DatePickerDashboard from "./components/datePicker";
import { getPageHeader } from "./helpers";
import { usePathname} from "next/navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const urlSegments = pathname.split("/").filter(Boolean);
    const currentPage = urlSegments[1] || urlSegments[0] || "dashboard";

    const currentUserRole: string = "admin";

    const showSideNav = false
    const { title, description } = getPageHeader(currentPage, currentUserRole)


    return (
        <Suspense>
            <div className={`${showSideNav && "grid grid-cols-12 gap-2"}`}>
                <div className="h-full bg-stone-100 p-2 lg:p-5 col-span-10">
                    <div className="hidden lg:block">
                        <DashTopNav />
                    </div>

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
                {showSideNav && <div className="col-span-2 bg-white p-2 rounded-2xl">
                    b
                </div>}

            </div>
        </Suspense>

    )
}



