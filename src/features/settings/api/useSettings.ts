import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface UserSettings {
    id: string;
    email: string;
    name: string;
    image: string | null;
    timezone: string;
    emailRemindersEnabled: boolean;
    inAppNotificationsEnabled: boolean;
    createdAt: string;
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await api.get<{ data: UserSettings }>("/users/me");
            return response.data;
        }
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: Partial<{
            name: string;
            email: string;
            timezone: string;
            emailRemindersEnabled: boolean;
            inAppNotificationsEnabled: boolean;
        }>) => {
            return api.patch("/users/me", updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            toast.success("Settings updated successfully");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to update settings"
            );
        }
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (passwords: {
            currentPassword: string;
            newPassword: string;
        }) => {
            return api.post("/users/me/change-password", passwords);
        },
        onSuccess: () => {
            toast.success("Password changed successfully");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to change password"
            );
        }
    });
}

export function useDeleteAccount() {
    return useMutation({
        mutationFn: async () => {
            return api.delete("/users/me");
        },
        onSuccess: () => {
            toast.success("Account deleted successfully");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete account"
            );
        }
    });
}
