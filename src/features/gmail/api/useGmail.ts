import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface GmailStatus {
    connected: boolean;
    lastSyncAt: string | null;
    isActive: boolean;
    historyId: string | null;
    syncTotal: number;
    syncProcessed: number;
}

export interface InboxEntry {
    id: string;
    gmailMessageId: string;
    subject: string;
    sender: string;
    senderName: string | null;
    snippet: string | null;
    receivedAt: string;
    extractedCompany: string | null;
    extractedJobTitle: string | null;
    extractedIntent: string | null;
    extractedSummary: string | null;
    extractedContacts: unknown;
    matchedApplicationId: string | null;
    matched: boolean;
    matchConfidence: number | null;
    manuallyLinked: boolean;
    processedAt: string | null;
    syncedAt: string;
    parseFailed: boolean;
    application?: { id: string; company: string; jobTitle: string; applicationStatus: string } | null;
    suggestions?: { id: string; type: string; status: string }[];
}

export interface InboxEntriesResponse {
    data: InboxEntry[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface PendingSuggestion {
    id: string;
    applicationId: string;
    type: string;
    suggestedValue: unknown;
    sourceInboxEntryId: string;
    status: string;
    createdAt: string;
    inboxEntry?: InboxEntry;
    application?: { id: string; company: string; jobTitle: string; applicationStatus: string };
}

export interface SuggestionsResponse {
    data: PendingSuggestion[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function useGmailStatus() {
    return useQuery({
        queryKey: ["gmail-status"],
        queryFn: async () => {
            const res = await api.get<{ data: GmailStatus | null }>("/gmail/status");
            return res.data;
        },
        refetchInterval: (query) => {
            const status = query.state.data;
            if (status?.data && status.data.syncProcessed < status.data.syncTotal && status.data.syncTotal > 0) {
                return 15_000;
            }
            return false;
        },
    });
}

export function useGmailConnect() {
    return useMutation({
        mutationFn: async () => {
            const res = await api.get("/gmail/connect");
            return (res.data as { data: { url: string } }).data.url;
        },
        onSuccess: (url) => {
            window.open(url, "_blank", "width=600,height=700");
            toast.success("Gmail connection started — check the popup window");
        },
        onError: () => {
            toast.error("Failed to start Gmail connection");
        },
    });
}

export function useGmailDisconnect() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post("/gmail/disconnect");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gmail-status"] });
            toast.success("Gmail disconnected");
        },
        onError: () => {
            toast.error("Failed to disconnect Gmail");
        },
    });
}

export function useGmailResync() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post("/gmail/resync");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gmail-status"] });
            toast.success("Re-sync started");
        },
        onError: () => {
            toast.error("Failed to start re-sync");
        },
    });
}

export function useInboxEntries(params?: { page?: number; limit?: number; filter?: string; search?: string }) {
    return useQuery({
        queryKey: ["inbox-entries", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit));
            if (params?.filter && params.filter !== "all") searchParams.set("filter", params.filter);
            if (params?.search) searchParams.set("search", params.search);
            const qs = searchParams.toString();
            const res = await api.get<InboxEntriesResponse>(`/gmail/inbox${qs ? `?${qs}` : ""}`);
            return res.data;
        },
    });
}

export function useInboxEntry(id: string | null) {
    return useQuery({
        queryKey: ["inbox-entry", id],
        queryFn: async () => {
            const res = await api.get<{ data: InboxEntry }>(`/gmail/inbox/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useLinkInboxEntry(entryId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (applicationId: string) => {
            await api.post(`/gmail/inbox/${entryId}/link`, { applicationId });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["inbox-entries"] });
            qc.invalidateQueries({ queryKey: ["inbox-entry", entryId] });
            toast.success("Email linked to application");
        },
        onError: () => {
            toast.error("Failed to link email");
        },
    });
}

export function useUnlinkInboxEntry(entryId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post(`/gmail/inbox/${entryId}/unlink`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["inbox-entries"] });
            qc.invalidateQueries({ queryKey: ["inbox-entry", entryId] });
            toast.success("Email unlinked from application");
        },
        onError: () => {
            toast.error("Failed to unlink email");
        },
    });
}

export function useSuggestions(params?: { page?: number; limit?: number; status?: string; applicationId?: string }) {
    return useQuery({
        queryKey: ["suggestions", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit));
            if (params?.status) searchParams.set("status", params.status);
            if (params?.applicationId) searchParams.set("applicationId", params.applicationId);
            const qs = searchParams.toString();
            const res = await api.get<SuggestionsResponse>(`/gmail/suggestions${qs ? `?${qs}` : ""}`);
            return res.data;
        },
    });
}

export function useAcceptSuggestion(suggestionId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post(`/gmail/suggestions/${suggestionId}/accept`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suggestions"] });
            qc.invalidateQueries({ queryKey: ["inbox-entries"] });
            toast.success("Suggestion accepted");
        },
        onError: () => {
            toast.error("Failed to accept suggestion");
        },
    });
}

export function useDismissSuggestion(suggestionId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post(`/gmail/suggestions/${suggestionId}/dismiss`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suggestions"] });
            toast.success("Suggestion dismissed");
        },
        onError: () => {
            toast.error("Failed to dismiss suggestion");
        },
    });
}
