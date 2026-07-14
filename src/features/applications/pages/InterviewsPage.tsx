import { Calendar, Clock, Briefcase, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useUpcomingInterviews } from "../api/useApplicationDetails";
import { PageContainer, PageHeader } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InterviewRound {
    id: string;
    applicationId: string;
    roundType: string;
    scheduledAt: string;
    interviewerName: string | null;
    notes: string | null;
    outcome: string | null;
    company: string;
    jobTitle: string;
}

export function InterviewsPage() {
    const { data: interviews, isLoading } = useUpcomingInterviews();
    
    const sortedInterviews = [...(interviews || [])].sort(
        (a, b) => parseISO(a.scheduledAt).getTime() - parseISO(b.scheduledAt).getTime()
    );

    if (isLoading) {
        return (
            <PageContainer maxWidth="xl" className="max-w-6xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-5">
                        <Skeleton className="size-14 rounded-xl" />
                        <div>
                            <Skeleton className="h-10 w-48 mb-2" />
                            <Skeleton className="h-5 w-72" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="xl" className="relative overflow-hidden">
            {/* Background Telemetry Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02] pointer-events-none select-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="relative z-10">
                <PageHeader
                    icon={Calendar}
                    title="Interviews"
                    description="Track and prepare for your upcoming interview rounds."
                />

            {sortedInterviews.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-outline rounded-xl bg-surface-container-low animate-in fade-in zoom-in-95 duration-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-on-surface-variant" />
                    <h3 className="text-xl font-semibold mb-2 text-on-surface">No upcoming interviews</h3>
                    <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
                        Schedule interviews within your applications to see them listed here in chronological order.
                    </p>
                    <Link to="/app/applications">
                        <Button variant="outline" className="gap-2">
                            View Applications
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedInterviews.map((interview: InterviewRound, index: number) => (
                        <div 
                            key={interview.id}
                            className={cn(
                                "group flex flex-col md:flex-row bg-surface rounded-xl border border-outline shadow-sm hover:shadow-md transition-all overflow-hidden",
                                "animate-in fade-in slide-in-from-right-4 fill-mode-both"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="md:w-48 bg-surface-container-low p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-outline-variant group-hover:bg-accent-container/30 transition-colors">
                                <p className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant mb-1">
                                    {format(parseISO(interview.scheduledAt), "EEEE")}
                                </p>
                                <p className="text-4xl font-black tracking-tight text-on-surface">
                                    {format(parseISO(interview.scheduledAt), "dd")}
                                </p>
                                <p className="text-xs font-bold tracking-widest text-accent mt-1">
                                    {format(parseISO(interview.scheduledAt), "MMM yyyy")}
                                </p>
                            </div>

                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-surface-container border border-outline flex items-center justify-center overflow-hidden rounded">
                                            <Briefcase className="w-5 h-5 text-on-surface-variant" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-on-surface leading-none">
                                                {interview.company}
                                            </h3>
                                            <p className="text-on-surface-variant font-medium text-sm">
                                                {interview.jobTitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                                            <Clock className="w-4 h-4 text-accent" />
                                            {format(parseISO(interview.scheduledAt), "hh:mm a")}
                                        </div>
                                        <Badge variant="accent" className="text-label-sm uppercase tracking-widest font-bold h-6 px-2">
                                            {interview.roundType}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link to={`/app/applications/${interview.applicationId}`}>
                                        <Button 
                                            size="sm" 
                                            className="gap-2"
                                        >
                                            View Application
                                            <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </PageContainer>
    );
}
