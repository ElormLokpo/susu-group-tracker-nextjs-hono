import { CLIENT_ROUTES } from "@/app/constants";
import Link from "next/link";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen lg:grid lg:grid-cols-2 lg:gap-5 ">
            <div className="hidden lg:block p-5">
                <div className="h-full rounded-3xl" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1742476126735-cba186771cf2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D)", backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div className="h-full bg-black/40 text-stone-100 rounded-3xl flex flex-col justify-between">
                        <div className="p-20 ">
                            <Link href={CLIENT_ROUTES.home} className="text-lime-500 font-semibold text-xl hover:underline">SuSu</Link>
                        </div>

                        <div className="py-20 pl-20 pr-40">
                            <div className="text-[33px] mb-2 leading-9">Save with us. Turn small weekly savings into big lump sums</div>
                            <div className="text-[14px] leading-8 tracking-[2px]">Join a trusted Susu group, contribute weekly, and collect your payout when it’s your turn. Simple, interest-free group savings.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {children}

            </div>
        </div>
    )
}