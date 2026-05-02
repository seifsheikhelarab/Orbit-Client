import { memo, useState, useRef, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MapPin, MoreHorizontal, ExternalLink, Pencil, Trash2, Clock, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Application {
    id: string
    company: string
    jobTitle: string
    applicationStatus: string
    location?: string
    jobURL?: string
    salaryMin?: number
    salaryMax?: number
    appliedDate?: string
    notes?: string
    followUpDate?: string
    source?: string
    createdAt: string
    updatedAt: string
}

interface KanbanCardProps {
    application: Application
    isDragging?: boolean
    onClick: () => void
    documentCount?: number
}

const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    const format = (n: number) => `$${(n / 1000).toFixed(0)}k`
    if (min && max) return `${format(min)} - ${format(max)}`
    if (min) return `${format(min)}+`
    return `< ${format(max!)}`
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
        return null
    }
}

export const KanbanCard = memo(function KanbanCard({
    application,
    isDragging,
    onClick,
    documentCount,
    index = 0
}: KanbanCardProps & { index?: number }) {
    const navigate = useNavigate()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging
    } = useSortable({ id: application.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [menuOpen])

    const salary = formatSalary(application.salaryMin, application.salaryMax)
    const appliedAgo = formatDate(application.appliedDate)
    const followUpDate = application.followUpDate ? new Date(application.followUpDate) : null
    const isOverdue = followUpDate && followUpDate < new Date(new Date().toDateString())
    const isUpcoming = followUpDate && followUpDate >= new Date(new Date().toDateString())

    return (
        <div
             ref={setNodeRef}
             {...attributes}
             {...listeners}
             onClick={onClick}
             role="button"
             tabIndex={0}
             onKeyDown={(e) => {
               if (e.key === 'Enter' || e.key === ' ') {
                 e.preventDefault()
                 onClick()
               }
             }}
             className={cn(
                 "group relative p-5 rounded-2xl bg-surface-container-low",
                 "cursor-grab active:cursor-grabbing",
                 "transition-all duration-300 ease-out-quart",
                 "hover:bg-surface-container",
                 "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                 (isDragging || isSortableDragging) && [
                     "opacity-90 shadow-2xl shadow-primary/20 scale-105 z-50",
                     "transition-duration-75"
                 ],
                 isOverdue && "ring-2 ring-error ring-offset-2 ring-offset-background",
                 "animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-both"
             )}
             style={{ ...style, animationDelay: `${index * 50}ms` }}
             onMouseDown={(e) => {
                 if (e.button === 0) {
                     e.currentTarget.classList.add('scale-[0.98]')
                 }
             }}
             onMouseUp={(e) => {
                 e.currentTarget.classList.remove('scale-[0.98]')
             }}
         >
            <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none overflow-hidden rounded-tr-2xl" aria-hidden="true">
                 <div className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full" />
                 <div className="absolute top-2 right-5 w-1 h-1 bg-primary rounded-full opacity-50" />
                 <div className="absolute top-5 right-2 w-1 h-1 bg-primary rounded-full opacity-50" />
             </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/50 mb-1 flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-primary/30" />
                            Ref: {application.id.slice(-4)}
                        </div>
                        <h4 className="font-headline font-bold text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-300 truncate tracking-tight">
                            {application.company}
                        </h4>
                        <p className="text-body-sm font-medium text-on-surface-variant truncate mt-0.5">{application.jobTitle}</p>
                    </div>

                    <div ref={menuRef} className="relative z-10" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                            <DropdownMenuTrigger asChild>
                        <button
                                     className={cn(
                                         "p-2 rounded-xl",
                                         "opacity-0 group-hover:opacity-100 focus:opacity-100",
                                         "hover:bg-surface-container-high",
                                         "transition-all duration-200 ease-out-quart",
                                         "active:scale-90 active:duration-75"
                                     )}
                                     aria-label="Card actions"
                                 >
                                    <MoreHorizontal className={cn(
                                        "w-4 h-4 text-on-surface-variant",
                                        "transition-transform duration-200",
                                        menuOpen && "rotate-90"
                                    )} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-2xl border-outline-variant">
                                <DropdownMenuItem onClick={() => navigate(`/app/applications/${application.id}`)} className="rounded-lg gap-3">
                                    <ExternalLink className="h-4 w-4 opacity-70" />
                                    View Dossier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/app/applications/${application.id}/edit`)} className="rounded-lg gap-3">
                                    <Pencil className="h-4 w-4 opacity-70" />
                                    Edit Entry
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-outline-variant/50" />
                                <DropdownMenuItem className="text-error focus:text-error rounded-lg gap-3">
                                    <Trash2 className="h-4 w-4 opacity-70" />
                                    Purge Data
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-label-sm text-on-surface-variant/80">
                    {application.location && (
                        <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-primary/40" />
                            {application.location}
                        </span>
                    )}
                    {appliedAgo && (
                        <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-primary/40" />
                            {appliedAgo}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                    <div className="flex items-center gap-2">
                        {salary && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wide">
                                {salary}
                            </span>
                        )}
                        {documentCount !== undefined && documentCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/10 text-accent text-[11px] font-bold">
                                <FileText className="w-3 h-3" />
                                {documentCount}
                            </span>
                        )}
                    </div>
                    
                    {followUpDate && isUpcoming && (
                        <div className={cn(
                            "size-2 rounded-full",
                            isOverdue ? "bg-error animate-pulse" : "bg-primary"
                        )} />
                    )}
                </div>
            </div>
        </div>
    )
})
