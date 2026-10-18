
import { useMemo } from 'react';
import Link from "next/link"
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

export const DashTopNav = ({currentPage}:{currentPage:string}) => {

    const currentUserRole: string = "admin"




    return (
        <div className="flex bg-white border-b border-stone-200 px-2 justify-between py-2 mb-5">
            <div className="grid grid-cols-2 gap-2 items-center hover:cursor-pointer ">
                {currentPage}
            </div>

            <div>

                <div className="bg-stone-100 hover:bg-stone-200 rounded-full px-2 py-2 flex justify-center items-center  text-lg">
                    <Link href={""}><MdNotificationsNone /></Link>
                </div>

            </div>
        </div>
    )
}