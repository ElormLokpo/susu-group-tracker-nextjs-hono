

export const TopAuthBanner = () => {
    return (
        <div className="bg-indigo-500 w-full py-5 text-xs flex items-center  justify-center px-3 text-white">
            <span className="flex items-center gap-2">
                Login with these test credentials to get started :
                <span className="text-stone-200 underline hover:text-stone-300 hover:cursor-pointer">
                    Email: admin@susu.test
                </span>
                <span className="text-stone-200 underline hover:text-stone-300 hover:cursor-pointer">
                    Password: Password@123
                </span>


            </span>
        </div>
    );
};