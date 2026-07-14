import { useState, memo } from "react"
import { useNavigate } from "react-router-dom"
import { formatSalary, formatDate, formatFollowUp } from "@/lib/format"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Settings2,
    Check,
    Square
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/StatusBadge"
import type { ApplicationStatus } from "@/lib/status"
import { EmptyState } from "@/components/shared/EmptyState"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { Application } from "@/features/applications/api/useApplications"

interface TableViewProps {
    applications: Application[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
    sortField: string
    sortOrder: "asc" | "desc"
    onSort: (field: string) => void
    onPageChange: (page: number) => void
    selectedIds: Set<string>
    onToggleSelect: (id: string) => void
    onSelectAll: (selectAll: boolean, selectMatchingFilter: boolean) => void
    totalFiltered: number
}

const columns = [
    { key: "company", label: "Company", sortable: true },
    { key: "jobTitle", label: "Job Title", sortable: true },
    { key: "applicationStatus", label: "Status", sortable: true },
    { key: "location", label: "Location", sortable: false },
    { key: "appliedDate", label: "Applied", sortable: true },
    { key: "salaryRange", label: "Salary", sortable: false },
    { key: "notes", label: "Notes", sortable: false },
    { key: "followUp", label: "Follow-up", sortable: false }
]

export const TableView = memo(function TableView({
    applications,
    pagination,
    sortField,
    sortOrder,
    onSort,
    onPageChange,
    selectedIds,
    onToggleSelect,
    onSelectAll,
    totalFiltered
}: TableViewProps) {
    const navigate = useNavigate()
    type ColumnVisibility = Record<string, boolean>
    const defaultColumns: ColumnVisibility = {
        company: true,
        jobTitle: true,
        applicationStatus: true,
        location: true,
        appliedDate: true,
        salaryRange: false,
        notes: false,
        followUp: false
    }
    const [showSelectMenu, setShowSelectMenu] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(() => {
        try {
            const saved = localStorage.getItem("orbit-table-columns")
            if (saved) return { ...defaultColumns, ...JSON.parse(saved) } as ColumnVisibility
        } catch { /* ignore */ }
        return defaultColumns
    })

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) => {
            const next = { ...prev, [key]: !prev[key as keyof typeof prev] }
            try { localStorage.setItem("orbit-table-columns", JSON.stringify(next)) } catch { /* ignore */ }
            return next
        })
    }

    const getVisibleColumns = () =>
        columns.filter((col) => visibleColumns[col.key as keyof typeof visibleColumns])

    const total = pagination.total || 0
    const startIndex = total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0
    const endIndex = total > 0 ? Math.min(pagination.page * pagination.limit, total) : 0

    const getPageNumbers = () => {
        const pages: (number | "...")[] = []
        const total = pagination.pages
        const current = pagination.page

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i)
        } else {
            pages.push(1)
            if (current > 3) pages.push("...")
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                pages.push(i)
            }
            if (current < total - 2) pages.push("...")
            pages.push(total)
        }
        return pages
    }

    if (applications.length === 0) {
        return (
            <EmptyState
                title="No applications found"
                description="Try adjusting your filters or add a new application."
                className="py-16"
                action={{
                    label: "Add Application",
                    onClick: () => navigate("/app/applications/new"),
                }}
            />
        )
    }

    return (
        <div className="rounded-2xl bg-surface-container-low overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-surface-container-high">
                            <th className="px-5 py-4 w-12">
                                <div className="relative">
                                    <button
                                        type="button"
                                        aria-label="Select applications"
                                        onClick={() => setShowSelectMenu(!showSelectMenu)}
                                        className={cn(
                                            "p-1.5 rounded-lg transition-all duration-150",
                                            selectedIds.size > 0 ? "bg-primary text-on-primary" : "hover:bg-surface-container"
                                        )}
                                    >
                                        {selectedIds.size === applications.length && applications.length > 0 ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                    {showSelectMenu && (
                                        <div className="absolute top-full mt-1 left-0 bg-surface border border-outline rounded-xl shadow-lg py-1 z-10 min-w-[200px]">
                                            <button
                                                type="button"
                                                onClick={() => { onSelectAll(true, false); setShowSelectMenu(false) }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
                                            >
                                                <Check className="w-3 h-3" />
                                                Select all on page ({applications.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { onSelectAll(true, true); setShowSelectMenu(false) }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
                                            >
                                                <Check className="w-3 h-3" />
                                                Select all matching filter ({totalFiltered})
                                            </button>
                                            {selectedIds.size > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => { onSelectAll(false, false); setShowSelectMenu(false) }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-surface-container transition-colors"
                                                >
                                                    Deselect all
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </th>
                            {getVisibleColumns().map((col) => (
                                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-on-surface-variant">
                                    {col.sortable ? (
                                         <button
                                             type="button"
                                             onClick={() => onSort(col.key)}
                                             className={cn(
                                                "inline-flex items-center gap-1.5 hover:text-primary transition-colors",
                                                sortField === col.key ? "text-primary" : ""
                                            )}
                                        >
                                            {col.label}
                                            {sortField === col.key ? (
                                                sortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                                            ) : (
                                                <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                                            )}
                                        </button>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            ))}
                                <th className="px-4 py-3 text-right w-12">
                                 <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                         <button type="button" className="p-1.5 rounded-lg hover:bg-surface-container transition-colors" title="Toggle columns" aria-label="Toggle columns">
                                             <Settings2 className="w-4 h-4 text-on-surface-variant" />
                                         </button>
                                     </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {columns.map((col) => (
                                            <DropdownMenuCheckboxItem
                                                key={col.key}
                                                checked={visibleColumns[col.key as keyof typeof visibleColumns]}
                                                onCheckedChange={() => toggleColumn(col.key)}
                                            >
                                                {col.label}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr
                                 key={app.id}
                                 className={cn(
                                     "transition-all duration-300 ease-out-quart",
                                     "animate-in fade-in slide-in-from-left-4 fill-mode-both",
                                     selectedIds.has(app.id) 
                                         ? "bg-primary-fixed-dim/30" 
                                         : "hover:bg-surface-container hover:shadow-sm"
                                 )}
                                 style={{ animationDelay: `${index * 30}ms` }}
                             >
                                 <td className="px-5 py-4 w-12" onClick={(e) => e.stopPropagation()}>
                                     <button
                                         type="button"
                                         onClick={() => onToggleSelect(app.id)}
                                         className={cn(
                                             "p-1.5 rounded-lg transition-all duration-150",
                                             selectedIds.has(app.id) ? "bg-primary text-on-primary" : "hover:bg-surface-container"
                                         )}
                                         aria-label={selectedIds.has(app.id) ? "Deselect application" : "Select application"}
                                     >
                                         {selectedIds.has(app.id) ? <Check className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                     </button>
                                 </td>
                                 <td 
                                     className="px-5 py-4 cursor-pointer group/cell" 
                                     onClick={() => navigate(`/app/applications/${app.id}`)}
                                     role="button"
                                     tabIndex={0}
                                     onKeyDown={(e) => {
                                         if (e.key === 'Enter' || e.key === ' ') {
                                             e.preventDefault()
                                             navigate(`/app/applications/${app.id}`)
                                         }
                                     }}
                                 >
                                     <span className="font-headline font-semibold text-on-surface text-body-md group-hover/cell:text-primary transition-colors duration-200">{app.company}</span>
                                 </td>
                                {visibleColumns.jobTitle && (
                                     <td 
                                         className="px-5 py-4 text-on-surface-variant text-body-md cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {app.jobTitle}
                                     </td>
                                 )}
                                {visibleColumns.applicationStatus && (
                                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                        <StatusBadge status={app.applicationStatus as ApplicationStatus} size="sm" />
                                    </td>
                                )}
                                {visibleColumns.location && (
                                     <td 
                                         className="px-5 py-4 text-on-surface-variant text-body-md hidden lg:table-cell cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {app.location || "-"}
                                     </td>
                                 )}
                                {visibleColumns.appliedDate && (
                                     <td 
                                         className="px-5 py-4 text-on-surface-variant text-body-md hidden sm:table-cell cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {formatDate(app.appliedDate)}
                                     </td>
                                 )}
                                {visibleColumns.salaryRange && (
                                     <td 
                                         className="px-5 py-4 text-on-surface-variant text-body-md cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {formatSalary(app.salaryMin, app.salaryMax)}
                                     </td>
                                 )}
                                {visibleColumns.notes && (
                                     <td 
                                         className="px-5 py-4 text-on-surface-variant text-body-md max-w-[200px] truncate hidden xl:table-cell cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {app.notes || "-"}
                                     </td>
                                 )}
                                {visibleColumns.followUp && (
                                     <td 
                                         className="px-5 py-4 text-body-md cursor-pointer" 
                                         onClick={() => navigate(`/app/applications/${app.id}`)}
                                         role="button"
                                         tabIndex={0}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter' || e.key === ' ') {
                                                 e.preventDefault()
                                                 navigate(`/app/applications/${app.id}`)
                                             }
                                         }}
                                     >
                                         {app.followUpDate
                                             ? (() => {
                                                 const followUp = formatFollowUp(app.followUpDate)
                                                 return typeof followUp === "string" ? followUp : <span className={followUp.className}>{followUp.text}</span>
                                             })()
                                             : "-"}
                                     </td>
                                 )}
                                <td className="px-5 py-4 text-right w-12" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/app/applications/${app.id}/edit`)} className="hover:bg-surface-container transition-colors duration-150">
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-surface-container-high">
                <p className="text-label-md text-on-surface-variant">
                    {total > 0 ? `Showing ${startIndex}-${endIndex} of ${total}` : 'No results'}
                </p>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onPageChange(1)} disabled={pagination.page === 1} className="h-9 w-9 p-0 hover:bg-surface-container transition-all duration-150">
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1} className="h-9 w-9 p-0 hover:bg-surface-container transition-all duration-150">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {getPageNumbers().map((p, i) =>
                        p === "..." ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-on-surface-variant">...</span>
                        ) : (
                            <button
                                type="button"
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={cn(
                                    "h-9 min-w-[2.25rem] px-2 rounded-lg text-label-md transition-all duration-150",
                                    p === pagination.page 
                                        ? "bg-primary text-on-primary font-semibold shadow-sm" 
                                        : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <Button variant="ghost" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="h-9 w-9 p-0 hover:bg-surface-container transition-all duration-150">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onPageChange(pagination.pages)} disabled={pagination.page === pagination.pages} className="h-9 w-9 p-0 hover:bg-surface-container transition-all duration-150">
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
})
