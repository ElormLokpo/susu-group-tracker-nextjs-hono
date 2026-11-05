"use client"
import { Suspense } from "react";
import { DashTopNav } from "./components/dash-top-nav";
import SideNav from "./components/side-nav";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   

    const showRightNav = false
  

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



