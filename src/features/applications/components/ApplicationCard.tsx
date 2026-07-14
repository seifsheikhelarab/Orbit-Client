import { memo } from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { MapPin, CalendarDays, ArrowRight } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import type { Application } from "@/features/applications/api/useApplications"
import type { ApplicationStatus } from "@/lib/status"
import { cn } from "@/lib/utils"

interface ApplicationCardProps {
    application: Application
}

export const ApplicationCard = memo(function ApplicationCard({
    application,
}: ApplicationCardProps) {
    return (
        <Link 
            to={`/app/applications/${application.id}`} 
            className="block group"
        >
            <div className={cn(
                "bg-surface border-border/50 border p-6 rounded-2xl transition-all duration-300 hover:bg-surface-container-low relative overflow-hidden group/card",
            )}>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">

                        <h3 className="text-xl font-bold tracking-tight text-primary group-hover:text-accent transition-colors leading-tight">
                            {application.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                            <span className="text-sm">{application.company}</span>
                        </div>
                    </div>
                    <StatusBadge status={application.applicationStatus as ApplicationStatus} className="shadow-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                    <div className="space-y-3">
                        {application.location && (
                            <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant/80">
                                <MapPin className="w-3.5 h-3.5 text-primary/50" />
                                <span className="truncate">{application.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant/80">
                            <CalendarDays className="w-3.5 h-3.5 text-primary/50" />
                            <span>
                                {application.appliedDate
                                    ? format(new Date(application.appliedDate), "MMM d, yyyy")
                                    : format(new Date(application.createdAt), "MMM d, yyyy")}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-end">
                        {application.salaryMin && (
                            <div className="text-sm font-bold text-primary flex items-center gap-1.5">
                                <span className="text-label-sm font-bold text-on-surface-variant/40">Comp:</span>
                                <span>
                                    ${(application.salaryMin / 1000).toFixed(0)}k
                                    {application.salaryMax ? `-${(application.salaryMax / 1000).toFixed(0)}k` : "+"}
                                </span>
                            </div>
                        )}
                        <div className="mt-2 opacity-0 group-hover/card:opacity-100 translate-x-2 group-hover/card:translate-x-0 transition-all duration-300">
                            <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
})
