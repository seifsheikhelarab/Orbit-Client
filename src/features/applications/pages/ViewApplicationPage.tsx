import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
    FileText,
    Calendar,
    ArrowLeft,
    Pencil,
    MapPin,
    DollarSign,
    ExternalLink,
    Clock,
    Briefcase,
    Edit
} from "lucide-react";
import { useApplication } from "@/features/applications/api/useApplications";
import { useApplicationResumes } from "@/features/applications/api/useApplicationResumes";
import type { ApplicationResume } from "@/features/applications/api/useApplicationResumes";
import { useContacts, useCreateContact, useDeleteContact } from "@/features/applications/api/useApplicationDetails";
import { useInterviewRounds, useCreateInterviewRound, useDeleteInterviewRound } from "@/features/applications/api/useApplicationDetails";
import { useStatusHistory } from "@/features/applications/api/useApplicationDetails";
import { ContactsList } from "@/features/applications/components/ContactsList";
import { InterviewRoundsList } from "@/features/applications/components/InterviewRoundsList";
import { StatusHistoryTimeline } from "@/features/applications/components/StatusHistoryTimeline";
import { openInGoogleCalendar } from "@/lib/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "Not set";
    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return "Invalid date";
    }
}

export default function ViewApplicationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: response, isLoading, isError } = useApplication(id!);
    const { data: resumesResponse } = useApplicationResumes(id!);
    const { data: contacts, isLoading: isLoadingContacts } = useContacts(id!);
    const { data: rounds, isLoading: isLoadingRounds } = useInterviewRounds(id!);
    const { data: history, isLoading: isLoadingHistory } = useStatusHistory(id!);
    const createContact = useCreateContact(id!);
    const deleteContact = useDeleteContact(id!);
    const createRound = useCreateInterviewRound(id!);
    const deleteRound = useDeleteInterviewRound(id!);

    if (isLoading) {
        return (
            <PageContainer maxWidth="xl">
                <PageHeader
                    icon={Briefcase}
                    title="Loading..."
                    description="Fetching application details"
                />
                <div className="grid gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </PageContainer>
        );
    }

    if (isError || !response?.data) {
        return (
            <PageContainer maxWidth="xl">
                <PageHeader
                    icon={Briefcase}
                    title="Application Not Found"
                    description="The requested application could not be found"
                />
                <div className="flex flex-col items-center justify-center py-16">
                    <Button variant="ghost" onClick={() => navigate("/applications")}>
                        Return to applications
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const application = response.data;

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
            title=""
                actions={
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/applications")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button onClick={() => navigate(`/app/applications/${id}/edit`)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-12 gap-8 mb-12">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
                        <div className="space-y-1">
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-on-surface font-headline">
                                {application.company}
                            </h1>
                            <p className="text-xl font-medium text-on-surface-variant flex items-center gap-2">
                                <Briefcase className="size-5 opacity-60" />
                                {application.jobTitle}
                            </p>
                        </div>
                        <div className="shrink-0 scale-110 origin-right">
                            <StatusBadge status={application.applicationStatus} />
                        </div>
                    </div>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-container">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                Strategic Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {application.location && (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-surface-container-high group-hover/item:bg-primary-container/50 transition-colors">
                                            <MapPin className="w-5 h-5 text-on-surface-variant group-hover/item:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-label-sm font-bold tracking-widest text-on-surface-variant/60">Location</p>
                                            <p className="text-lg font-bold text-on-surface">{application.location}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 group/item">
                                    <div className="p-3 rounded-2xl bg-surface-container-high group-hover/item:bg-primary-container/50 transition-colors">
                                        <DollarSign className="w-5 h-5 text-on-surface-variant group-hover/item:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-label-sm font-bold tracking-widest text-on-surface-variant/60">Comp Package</p>
                                        <p className="text-lg font-bold text-on-surface">
                                            {application.salaryMin || application.salaryMax
                                                ? `${application.salaryMin ? `$${application.salaryMin.toLocaleString()}` : "?"} - ${application.salaryMax ? `$${application.salaryMax.toLocaleString()}` : "?"}`
                                                : "Undisclosed"}
                                        </p>
                                    </div>
                                </div>
                                {application.appliedDate && (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-surface-container-high group-hover/item:bg-primary-container/50 transition-colors">
                                            <Calendar className="w-5 h-5 text-on-surface-variant group-hover/item:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-label-sm font-bold tracking-widest text-on-surface-variant/60">Engagement Date</p>
                                            <p className="text-lg font-bold text-on-surface">
                                                {format(new Date(application.appliedDate), "MMMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {application.jobURL && (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-surface-container-high group-hover/item:bg-primary-container/50 transition-colors">
                                            <ExternalLink className="w-5 h-5 text-on-surface-variant group-hover/item:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-label-sm font-bold tracking-widest text-on-surface-variant/60">Intelligence Source</p>
                                            <a
                                                href={application.jobURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-lg font-bold text-primary hover:underline truncate block max-w-50"
                                            >
                                                External Listing
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {application.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-surface-container-highest">
                                        <FileText className="w-5 h-5 text-on-surface" />
                                    </div>
                                    Briefing Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-on-surface-variant leading-relaxed text-lg italic serif">"{application.notes}"</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-container">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                Status History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusHistoryTimeline items={history || []} isLoading={isLoadingHistory} />
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {application.followUpDate && (
                        <Card variant="glass" className="border-accent/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-accent">
                                    <div className="p-2 rounded-xl bg-accent-container">
                                        <Clock className="w-5 h-5 text-on-accent-container" />
                                    </div>
                                    Next Move
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-2xl font-black text-on-surface">{formatDate(application.followUpDate)}</p>
                                        {application.followUpNote && (
                                            <p className="text-sm font-medium text-on-surface-variant/80 mt-2 leading-snug">{application.followUpNote}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="accent"
                                        className="w-full shadow-lg shadow-accent/10"
                                        onClick={() =>
                                            openInGoogleCalendar({
                                                title: `Follow-up - ${application.company} - ${application.jobTitle}`,
                                                date: application.followUpDate!,
                                                description: application.followUpNote || undefined
                                            })
                                        }
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Update Intelligence
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-container">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                Attached Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {resumesResponse?.data && resumesResponse.data.length > 0 ? (
                                <div className="grid gap-4">
                                    {resumesResponse.data.map((r: ApplicationResume) => (
                                        <div key={r.id} className="group flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-primary-container/30 transition-all border border-transparent hover:border-primary/10">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm truncate">{r.resume.name}</p>
                                                    <p className="text-label-sm font-bold tracking-widest text-on-surface-variant/60">{r.resume?.type?.replace("_", " ")}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon-sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/app/resumes/${r.resumeId}`}><Edit className="w-4 h-4" /></Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-outline-variant rounded-2xl">
                                    <p className="text-sm text-on-surface-variant mb-4">No files attached</p>
                                    <Button variant="outline" size="sm" asChild className="rounded-full">
                                        <Link to={`/app/applications/${id}/attach`}>Attach Resume</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-container">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                Assets & Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ContactsList
                                contacts={contacts || []}
                                isLoading={isLoadingContacts}
                                onAdd={async (data) => { await createContact.mutateAsync({ ...data, title: data.title || undefined, email: data.email || undefined, phone: data.phone || undefined, linkedinUrl: data.linkedinUrl || undefined }); }}
                                onDelete={async (contactId) => { await deleteContact.mutateAsync(contactId); }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-container">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                Interview Rounds
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InterviewRoundsList
                                rounds={rounds || []}
                                isLoading={isLoadingRounds}
                                companyName={application.company}
                                jobTitle={application.jobTitle}
                                onAdd={async (data) => { await createRound.mutateAsync({ ...data, scheduledAt: data.scheduledAt || undefined, interviewerName: data.interviewerName || undefined, notes: data.notes || undefined, outcome: data.outcome || undefined }); }}
                                onDelete={async (roundId) => { await deleteRound.mutateAsync(roundId); }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
