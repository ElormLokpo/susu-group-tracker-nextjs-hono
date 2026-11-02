"use client"
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { API_ROUTES } from "../constants";
import { useAuthStore } from "../store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


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

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    const token = useAuthStore((state) => state.token);

    return useMutation({
        mutationFn: async (data: { name: string, weeklyAmount: number, maxNumberOfMembers: number }) => await api.post(API_ROUTES.createGroup, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            toast.success("Group created successfully");
            return data;
        },
    });
}

export const useJoinGroup = () => {
    const queryClient = useQueryClient();

    const token = useAuthStore((state) => state.token);

    return useMutation({
        mutationFn: async (data: { name: string, email: string, password: string, role: "member" | "admin" }) => await api.post(API_ROUTES.joinGroup, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            toast.success("Group joined successfully");
            return data;
        },
    });
}