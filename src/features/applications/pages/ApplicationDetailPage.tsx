import { useParams, useNavigate } from "react-router-dom";
import { FileText, X, ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import type { ApplicationFormValues } from "@/features/applications/components/ApplicationForm";
import {
    useApplication,
    useUpdateApplication,
    useDeleteApplication
} from "@/features/applications/api/useApplications";
import {
    useApplicationResumes,
    useDetachResume
} from "@/features/applications/api/useApplicationResumes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

export default function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data: response, isLoading, isError } = useApplication(id!);
    const { data: resumesResponse, isLoading: isLoadingDocs } = useApplicationResumes(id!);
    const { mutateAsync: updateApplication, isPending: isUpdating } = useUpdateApplication();
    const { mutateAsync: deleteApplication, isPending: isDeleting } = useDeleteApplication();
    const { mutateAsync: detachResume, isPending: isDetaching } = useDetachResume();

    if (isLoading) {
        return (
            <PageContainer maxWidth="xl">
                <div className="mb-8">
                    <Skeleton className="h-9 w-48 sm:w-64 mb-2" />
                    <Skeleton className="h-4 w-64 sm:w-96" />
                </div>
                <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 rounded-xl border border-(--color-outline-variant) space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </PageContainer>
        );
    }

    if (isError || !response?.data) {
        return (
            <PageContainer maxWidth="xl">
                <div className="flex flex-col items-center justify-center py-16">
                    <h2 className="text-xl text-error mb-4">Application not found</h2>
                    <Button variant="ghost" onClick={() => navigate("/applications")}>
                        Return to applications
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const application = response!.data;

    const handleSubmit = async (data: ApplicationFormValues) => {
        const payload: Record<string, unknown> = {
            company: data.company,
            jobTitle: data.jobTitle,
            applicationStatus: data.applicationStatus
        };

        if (data.jobURL) payload.jobURL = data.jobURL;
        if (data.location) payload.location = data.location;
        if (data.salaryMin) payload.salaryMin = Number(data.salaryMin);
        if (data.salaryMax) payload.salaryMax = Number(data.salaryMax);
        if (data.appliedDate)
            payload.appliedDate = new Date(data.appliedDate).toISOString();
        if (data.notes) payload.notes = data.notes;
        if (data.followUpDate)
            payload.followUpDate = new Date(data.followUpDate).toISOString();
        if (data.followUpNote) payload.followUpNote = data.followUpNote;

        await updateApplication({ id: id!, data: payload });
        navigate("/applications");
    };

    const handleDelete = async () => {
        await deleteApplication(id!);
        navigate("/applications");
    };

    const handleDetachResume = async (attachmentId: string) => {
        await detachResume({ applicationId: id!, attachmentId });
    };

    return (
        <>
            <PageContainer maxWidth="xl">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/app/applications/${id}`)} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to View
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Application</h1>
                    <p className="text-on-surface-variant text-sm mt-1">Update details for {application.company}</p>
                </div>

            <ApplicationForm
                initialData={application}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
                onDelete={async () => setShowDeleteConfirm(true)}
                isDeleting={isDeleting}
            />

                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary-fixed">
                                        <FileText className="w-4 h-4 text-on-primary-fixed" />
                                    </div>
                                    Attached Resumes
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => navigate(`/app/applications/${id}/attach`)}>
                                    Attach Resume
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoadingDocs ? (
                                <div className="grid gap-4">
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            ) : resumesResponse?.data && resumesResponse.data.length > 0 ? (
                                <div className="grid gap-4">
                                    {resumesResponse.data.map((r: any) => (
                                        <div
                                            key={r.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-on-primary-fixed" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{r.resume.name}</p>
                                                    <p className="text-xs text-on-surface-variant capitalize">
                                                        {r.resume.type.replace("_", " ")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDetachResume(r.id)}
                                                    disabled={isDetaching}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border border-dashed border-outline-variant rounded-xl">
                                    <FileText className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                                    <p className="text-sm text-on-surface-variant">
                                        No resumes attached yet
                                    </p>
                                    <Button variant="link" size="sm" className="mt-2" onClick={() => navigate(`/app/applications/${id}/attach`)}>
                                        Attach a resume
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Application?</DialogTitle>
                    </DialogHeader>
                    <p className="text-on-surface-variant text-sm">
                        This action cannot be undone. The application for {application.company} will be permanently deleted.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
