import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ResumeData, CoverLetterContent } from "../../cv-builder/types";

export interface ProfileData {
    id: string;
    userId: string;
    content: ResumeData;
    createdAt: string;
    updatedAt: string;
}

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await api.get("/profile");
            return response.data.data as ProfileData;
        }
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: ResumeData) => {
            const response = await api.put("/profile", { content });
            return response.data.data as ProfileData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });
}

export function useAutoCV() {
    return useMutation({
        mutationFn: async (jobDescription: string) => {
            const response = await api.post("/profile/generate", { jobDescription });
            return response.data.data as {
                jobData: unknown;
                tailoredContent: {
                    resumeContent: ResumeData;
                    coverLetter: CoverLetterContent;
                };
            };
        }
    });
}

export function useParseCv() {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("cv", file);
            const response = await api.post("/profile/parse-cv", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data.data as ResumeData;
        }
    });
}

export function useSaveAutoCV() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { jobData: unknown; tailoredContent: { resumeContent: ResumeData; coverLetter: CoverLetterContent } }) => {
            const response = await api.post("/profile/save", data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
        }
    });
}
