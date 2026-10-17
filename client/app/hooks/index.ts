"use client";
export * from "./authHook";

import { useRouter } from "next/navigation";

export function useNavigate() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const replaceTo = (path: string) => {
    router.replace(path);
  };

  const goBack = () => {
    router.back();
  };

  return {
    navigateTo,
    replaceTo,
    goBack,
  };
}
