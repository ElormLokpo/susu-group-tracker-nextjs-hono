import { MdOutlineErrorOutline } from "react-icons/md";

export const ErrorScreen = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="text-red-500 text-3xl flex gap-4 items-center justify-center  mb-5 text-center">
        <MdOutlineErrorOutline />
        <span className="">Someting went wrong please try again later!</span>
      </div>
    </div>
  );
};
