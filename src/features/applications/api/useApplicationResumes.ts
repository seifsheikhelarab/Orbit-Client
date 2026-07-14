import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface ApplicationResume {
    id: string;
    applicationId: string;
    resumeId: string;
    resume: {
        id: string;
        name: string;
        type: "RESUME" | "COVER_LETTER";
        content: Record<string, unknown>;
        settings: Record<string, unknown>;
    };
    createdAt: string;
}

export function useApplicationResumes(applicationId: string) {
    return useQuery({
        queryKey: ["application-resumes", applicationId],
        queryFn: async () => {
            const res = await api.get(`/applications/${applicationId}/resumes`);
            // Standardize handling of { data: [...] } from ResponseHandler
            const data = res.data?.data ?? res.data;
            return { data: Array.isArray(data) ? data : [] };
        },
        enabled: !!applicationId
    });
}

export function useAttachResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { resumeId: string; applicationId: string }) => {
            const res = await api.post(`/resumes/${data.resumeId}/attach`, { applicationId: data.applicationId });
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["application-resumes", variables.applicationId] });
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
    });
}

export function useDetachResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { applicationId: string; attachmentId: string }) => {
            const res = await api.delete(`/applications/${data.applicationId}/resumes/${data.attachmentId}`);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["application-resumes", variables.applicationId] });
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
    });
}
