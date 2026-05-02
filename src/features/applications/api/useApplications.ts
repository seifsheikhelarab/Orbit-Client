import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { 
    type ApplicationStatus, 
    APPLICATION_STATUS_CONFIG, 
    APPLICATION_STATUSES 
} from "@/lib/status";

export type { ApplicationStatus }
export { APPLICATION_STATUS_CONFIG, APPLICATION_STATUSES }

export interface Application {
    id: string;
    company: string;
    jobTitle: string;
    applicationStatus: ApplicationStatus;
    location?: string;
    jobURL?: string;
    salaryMin?: number;
    salaryMax?: number;
    appliedDate?: string;
    notes?: string;
    followUpDate?: string;
    followUpNote?: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApplicationsResponse {
    data: Application[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function buildQueryString(params: QueryParams): string {
    const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
        sort: params.sort,
        order: params.order
    });

    if (params.search) query.set("search", params.search);
    if (params.status.length > 0) query.set("status", params.status.join(","));
    if (params.location) query.set("location", params.location);
    if (params.appliedFrom) query.set("applied_from", params.appliedFrom);
    if (params.appliedTo) query.set("applied_to", params.appliedTo);
    if (params.salaryMin !== undefined)
        query.set("salary_min", String(params.salaryMin));
    if (params.salaryMax !== undefined)
        query.set("salary_max", String(params.salaryMax));

    return query.toString();
}

export interface QueryParams {
    search: string;
    status: ApplicationStatus[];
    location: string;
    appliedFrom: string;
    appliedTo: string;
    salaryMin?: number;
    salaryMax?: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
}

export const useApplications = (params: QueryParams) => {
    return useQuery({
        queryKey: ["applications", params],
        queryFn: async (): Promise<ApplicationsResponse> => {
            const res = await api.get(`/applications?${buildQueryString(params)}`);
            const responseBody = res.data; // { success, data: [...], pagination: {...} }
            if (responseBody && typeof responseBody === 'object' && 'data' in responseBody && 'pagination' in responseBody) {
                return responseBody;
            }
            // Fallback for unexpected shapes
            const data = res.data?.data ?? res.data;
            return {
                data: Array.isArray(data) ? data : (data?.applications || []),
                pagination: data?.pagination || { page: params.page, limit: params.limit, total: data?.total || 0, pages: 1 }
            };
        }
    });
};

export const useApplicationsByStatus = (status: ApplicationStatus) => {
    return useQuery({
        queryKey: ["applications", "status", status],
        queryFn: async (): Promise<ApplicationsResponse> => {
            const query = new URLSearchParams({
                status,
                limit: "1000"
            });
            const res = await api.get(`/applications?${query.toString()}`);
            const data = res.data?.data ?? res.data;
            if (data && typeof data === 'object' && 'data' in data && 'pagination' in data) {
                return data;
            }
            return {
                data: Array.isArray(data) ? data : (data?.applications || []),
                pagination: data?.pagination || { page: 1, limit: 1000, total: data?.total || 0, pages: 1 }
            };
        }
    });
};

export const useApplication = (id: string) => {
    return useQuery({
        queryKey: ["applications", id],
        queryFn: async (): Promise<{ data: Application }> => {
            const res = await api.get(`/applications/${id}`);
            const data = res.data?.data ?? res.data;
            // The frontend expects { data: Application }
            return { data: (data?.data ?? data) };
        },
        enabled: !!id
    });
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Application>) => {
            console.log("Creating application with data:", data);
            const response = await api.post("/applications", data);
            console.log("Create response:", response);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.refetchQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
            queryClient.refetchQueries({ queryKey: ["analytics"] });
            toast.success("Application created");
        },
        onError: (error: unknown) => {
            console.error("Create application error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create application");
        }
    });
};

export const useUpdateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data
        }: {
            id: string;
            data: Partial<Application>;
        }) => {
            return api.patch(`/applications/${id}`, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.refetchQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
            queryClient.refetchQueries({ queryKey: ["analytics"] });
            
            // Also invalidate the specific application query if it exists
            if (variables.id) {
                queryClient.invalidateQueries({ queryKey: ["applications", variables.id] });
            }
            
            toast.success("Application updated");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update application");
        }
    });
};

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/applications/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            toast.success("Application deleted");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete application");
        }
    });
};

export const useBulkUpdateApplications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { ids: string[]; status: ApplicationStatus }) => {
            return api.patch("/applications/bulk", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"], exact: false });
            toast.success("Applications updated");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update applications");
        }
    });
};

export const useBulkDeleteApplications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return api.delete("/applications/bulk", { data: { ids } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"], exact: false });
            toast.success("Applications deleted");
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete applications");
        }
    });
};

export const useApplicationsDocumentCounts = (applicationIds: string[]) => {
    return useQuery({
        queryKey: ["applications", "document-counts", applicationIds.join(",")],
        queryFn: async (): Promise<Record<string, number>> => {
            if (applicationIds.length === 0) return {};
            const ids = applicationIds.join(",");
            try {
                const res = await api.get(`/applications/document-counts?ids=${ids}`);
                return res.data || {};
            } catch (err) {
                console.error("[useApplicationsDocumentCounts] error:", err);
                return {};
            }
        },
        enabled: applicationIds.length > 0
    });
};

export const useAllApplicationIds = (filters?: Record<string, unknown>) => {
    return useQuery({
        queryKey: ["applications", "ids", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        if (Array.isArray(value)) {
                            value.forEach((v) => params.append(key, v));
                        } else {
                            params.append(key, String(value));
                        }
                    }
                });
            }
            const res = await api.get(`/applications/ids?${params.toString()}`);
            return res.data?.ids || [];
        },
        enabled: false
    });
};
