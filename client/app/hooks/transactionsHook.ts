import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { toast } from "sonner";
import { API_ROUTES } from "../constants";
import { useAuthStore } from "../store";


export const useGetTransactions = () => {
    const token = useAuthStore((state) => state.token)

    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const res = await api.get(API_ROUTES.getAllTransactions,
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


export const useGetTransaction = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const res = await api.get("/transactions");
            return res.data;
        },
        enabled: true,
    });
}

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/transactions", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Transaction created successfully");
        },
        onError: () => {
            toast.error("Something went wrong. Please try again later");
        },
    });
}

export const useUpdateTransaction = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.put("/transactions", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Transaction updated successfully");
        },
        onError: () => {
            toast.error("Something went wrong. Please try again later");
        },
    });
}

export const useDeleteTransaction = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await api.delete("/transactions");
            return res.data;
        },
        onSuccess: () => {
            toast.success("Transaction deleted successfully");
        },
        onError: () => {
            toast.error("Something went wrong. Please try again later");
        },
    });
}