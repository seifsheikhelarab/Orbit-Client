import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export interface Contact {
    id: string;
    applicationId: string;
    name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    createdAt: string;
}

export interface InterviewRound {
    id: string;
    applicationId: string;
    roundType: "PHONE_SCREEN" | "TECHNICAL" | "SYSTEM_DESIGN" | "BEHAVIORAL" | "FINAL" | "OTHER";
    scheduledAt: string | null;
    interviewerName: string | null;
    notes: string | null;
    outcome: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
    createdAt: string;
}

export interface StatusHistoryItem {
    id: string;
    applicationId: string;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    changedAt: string;
}

export function useContacts(applicationId: string) {
    return useQuery({
        queryKey: ["contacts", applicationId],
        queryFn: async () => {
            const res = await api.get<{ data: Contact[] }>(`/applications/${applicationId}/contacts`);
            return (res.data?.data ?? res.data) ?? [];
        },
        enabled: !!applicationId
    });
}

export function useCreateContact(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (contact: {
            name: string;
            title?: string;
            email?: string;
            phone?: string;
            linkedinUrl?: string;
        }) => {
            const response = await api.post(
                `/applications/${applicationId}/contacts`,
                contact
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
            queryClient.refetchQueries({ queryKey: ["contacts", applicationId] });
            toast.success("Contact added");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to add contact");
        }
    });
}

export function useUpdateContact(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            contactId,
            contact
        }: {
            contactId: string;
            contact: {
                name?: string;
                title?: string;
                email?: string;
                phone?: string;
                linkedinUrl?: string;
            };
        }) => {
            const response = await api.patch(
                `/applications/${applicationId}/contacts/${contactId}`,
                contact
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
            queryClient.refetchQueries({ queryKey: ["contacts", applicationId] });
            toast.success("Contact updated");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update contact");
        }
    });
}

export function useDeleteContact(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (contactId: string) => {
            const response = await api.delete(
                `/applications/${applicationId}/contacts/${contactId}`
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
            queryClient.refetchQueries({ queryKey: ["contacts", applicationId] });
            toast.success("Contact deleted");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete contact");
        }
    });
}

export function useInterviewRounds(applicationId: string) {
    return useQuery({
        queryKey: ["interviewRounds", applicationId],
        queryFn: async () => {
            const res = await api.get<{ data: InterviewRound[] }>(`/applications/${applicationId}/interviews`);
            return (res.data?.data ?? res.data) ?? [];
        },
        enabled: !!applicationId
    });
}

export function useCreateInterviewRound(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (round: {
            roundType: string;
            scheduledAt?: string;
            interviewerName?: string;
            notes?: string;
            outcome?: string;
        }) => {
            const response = await api.post(
                `/applications/${applicationId}/interviews`,
                round
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviewRounds", applicationId] });
            queryClient.refetchQueries({ queryKey: ["interviewRounds", applicationId] });
            toast.success("Interview round added");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to add interview round");
        }
    });
}

export function useUpdateInterviewRound(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            roundId,
            round
        }: {
            roundId: string;
            round: {
                roundType?: string;
                scheduledAt?: string;
                interviewerName?: string;
                notes?: string;
                outcome?: string;
            };
        }) => {
            const response = await api.patch(
                `/applications/${applicationId}/interviews/${roundId}`,
                round
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviewRounds", applicationId] });
            queryClient.refetchQueries({ queryKey: ["interviewRounds", applicationId] });
            toast.success("Interview round updated");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update interview round");
        }
    });
}

export function useDeleteInterviewRound(applicationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roundId: string) => {
            const response = await api.delete(
                `/applications/${applicationId}/interviews/${roundId}`
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviewRounds", applicationId] });
            queryClient.refetchQueries({ queryKey: ["interviewRounds", applicationId] });
            toast.success("Interview round deleted");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete interview round");
        }
    });
}

export function useUpcomingInterviews() {
    return useQuery({
        queryKey: ["interviews", "upcoming"],
        queryFn: async () => {
            const res = await api.get<{ data: InterviewRound[] }>("/applications/interviews/upcoming");
            return (res.data?.data ?? res.data) ?? [];
        }
    });
}

export function useStatusHistory(applicationId: string) {
    return useQuery({
        queryKey: ["statusHistory", applicationId],
        queryFn: async () => {
            const res = await api.get<{ data: StatusHistoryItem[] }>(`/applications/${applicationId}/status-history`);
            return (res.data?.data ?? res.data) ?? [];
        },
        enabled: !!applicationId
    });
}
