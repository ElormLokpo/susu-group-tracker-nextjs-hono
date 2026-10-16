import Link from "next/link";

export const TopNav = () => {
    return (
        <div className="  py-2 flex items-center justify-center">
            <div className="bg-stone-800 shadow shadow-stone-800 py-2 pl-5 pr-2 text-sm rounded-full flex items-center justify-between w-100 text-stone-100">
                <Link href="/" className="font-semibold">Susu</Link>

                <div className="flex gap-3 text-xs items-center">
                    <Link className="hover:underline" href="/"> How it works</Link>

                    <Link className="hover:underline" href="/"> Login</Link>
                    <Link href="/" className="bg-white text-stone-900 rounded-full p-2 hover:bg-stone-100 text-xs"> Get Started</Link>
                </div>
            </div>
        </div>
    );
};



