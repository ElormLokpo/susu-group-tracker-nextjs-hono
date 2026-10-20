import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { API_ROUTES } from "../constants";
import { useAuthStore } from "../store";

export const useGetGroups = () => {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await api.get(
                API_ROUTES.getAllGroups,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        },
        enabled: true,
    });
}