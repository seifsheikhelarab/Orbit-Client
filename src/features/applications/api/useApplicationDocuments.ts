import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface AttachedDocument {
    id: string;
    documentId: string;
    documentName: string;
    documentType: string;
    versionId: string;
    versionNumber: number;
    originalFilename: string;
    fileSizeBytes: number;
    mimeType: string;
    attachedAt: string;
}

export const useApplicationDocuments = (applicationId: string) => {
    return useQuery({
        queryKey: ["application-documents", applicationId],
        queryFn: async (): Promise<{ data: AttachedDocument[] }> => {
            const res = await api.get(`/applications/${applicationId}/documents`);
            return res.data;
        },
        enabled: !!applicationId
    });
};

export const useAttachDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            applicationId,
            documentVersionId
        }: {
            applicationId: string;
            documentVersionId: string;
        }) => {
            return api.post(`/applications/${applicationId}/documents`, {
                documentVersionId
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["application-documents", variables.applicationId]
            });
            queryClient.refetchQueries({
                queryKey: ["application-documents", variables.applicationId]
            });
        }
    });
};

export const useDetachDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            applicationId,
            attachmentId
        }: {
            applicationId: string;
            attachmentId: string;
        }) => {
            return api.delete(
                `/applications/${applicationId}/documents/${attachmentId}`
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["application-documents", variables.applicationId]
            });
            queryClient.refetchQueries({
                queryKey: ["application-documents", variables.applicationId]
            });
        }
    });
};
