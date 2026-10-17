import { ClipLoader } from "react-spinners";

export const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <ClipLoader color="#3cffd0" />
    </div>
  );
};
