import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Filter, Calendar, DollarSign, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
    useApplications,
    useApplicationsDocumentCounts,
    useUpdateApplication,
    useBulkUpdateApplications,
    useBulkDeleteApplications,
    APPLICATION_STATUSES,
    APPLICATION_STATUS_CONFIG,
    ApplicationStatus,
    type Application
} from "@/features/applications/api/useApplications";
import { useUIStore } from "@/hooks/useUIStore";
import { useApplicationsQuery } from "@/hooks/useApplicationsQuery";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterChip, FilterChips } from "@/components/filters/FilterChips";
import { StatusFilterGroup } from "@/components/filters/StatusFilterPill";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { EmptyState } from "@/components/shared/EmptyState";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TableView } from "@/components/table/TableView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton, KanbanSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/ui";

export default function ApplicationsPage() {
    const navigate = useNavigate();
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "n") {
                e.preventDefault();
                navigate("/app/applications/new");
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [navigate]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [localLocation, setLocalLocation] = useState("");
    const [localDateFrom, setLocalDateFrom] = useState("");
    const [localDateTo, setLocalDateTo] = useState("");
    const [localSalaryMin, setLocalSalaryMin] = useState("");
    const [localSalaryMax, setLocalSalaryMax] = useState("");

    const viewMode = useUIStore((s) => s.viewMode);
    const setViewMode = useUIStore((s) => s.setViewMode);
    const setSortPrefs = useUIStore((s) => s.setSortPrefs);
    const {
        filters,
        page,
        sort,
        order,
        setSearch,
        setStatusFilter,
        setLocationFilter,
        setDateRange,
        setSalaryRange,
        setPage,
        setSortParams,
        clearFilters,
        getQueryParams,
        activeFilterCount
    } = useApplicationsQuery(20);

    const queryParams = getQueryParams(page);
    const { data: response, isLoading, isError } = useApplications(queryParams);
    const updateApplication = useUpdateApplication();
    
    // response is now already unwrapped by hook (res.data)
    const applications = response?.data || [];
    const applicationIds = applications.map((app: Application) => app.id) || [];
    const { data: documentCounts } = useApplicationsDocumentCounts(applicationIds);

    const bulkUpdate = useBulkUpdateApplications();
    const bulkDelete = useBulkDeleteApplications();

    const handleStatusChange = async (id: string, status: ApplicationStatus) => {
        try {
            await updateApplication.mutateAsync({ id, data: { applicationStatus: status } });
        } catch {
            // Error handled by mutation hook
        }
    };

    const allApplicationIds = useMemo(() => {
        return applications.map((app: Application) => app.id) || [];
    }, [applications]);

    const totalFiltered = response?.pagination?.total || 0;

    const handleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            setSelectedIds(new Set(allApplicationIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleBulkStatusChange = async (status: ApplicationStatus) => {
        try {
            await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), status });
            toast.success(`Updated ${selectedIds.size} application${selectedIds.size > 1 ? 's' : ''} to ${APPLICATION_STATUS_CONFIG[status].label}`);
            setSelectedIds(new Set());
            setShowStatusMenu(false);
        } catch {
            toast.error("Failed to update applications");
        }
    };

    const handleBulkDelete = async () => {
        try {
            await bulkDelete.mutateAsync(Array.from(selectedIds));
            toast.success(`Deleted ${selectedIds.size} application${selectedIds.size > 1 ? 's' : ''}`);
            setSelectedIds(new Set());
            setShowDeleteConfirm(false);
        } catch {
            toast.error("Failed to delete applications");
        }
    };

    const handleSort = (field: string) => {
        if (sort === field) {
            const newOrder = order === "asc" ? "desc" : "asc";
            setSortParams(field, newOrder);
            setSortPrefs(field, newOrder);
        } else {
            setSortParams(field, "asc");
            setSortPrefs(field, "asc");
        }
    };

    const handleRemoveStatus = (status: ApplicationStatus) => {
        setStatusFilter(filters.status.filter((s) => s !== status));
    };

    const handleToggleStatus = (status: ApplicationStatus) => {
        if (filters.status.includes(status)) {
            setStatusFilter(filters.status.filter((s) => s !== status));
        } else {
            setStatusFilter([...filters.status, status]);
        }
    };

    const handleApplyFilters = () => {
        if (localLocation !== filters.location) setLocationFilter(localLocation);
        if (localDateFrom !== filters.appliedFrom || localDateTo !== filters.appliedTo) {
            setDateRange(localDateFrom, localDateTo);
        }
        const min = localSalaryMin ? Number(localSalaryMin) : undefined;
        const max = localSalaryMax ? Number(localSalaryMax) : undefined;
        if (min !== filters.salaryMin || max !== filters.salaryMax) {
            setSalaryRange(min, max);
        }
        setFilterPanelOpen(false);
    };

    const handleClearAll = () => {
        setLocalLocation("");
        setLocalDateFrom("");
        setLocalDateTo("");
        setLocalSalaryMin("");
        setLocalSalaryMax("");
        clearFilters();
    };

    if (isLoading) {
        return (
            <PageContainer maxWidth="xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-14 rounded-xl" />
                        <div>
                            <Skeleton className="h-10 w-48 mb-2" />
                            <Skeleton className="h-5 w-72" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-11 w-24" />
                    </div>
                </div>
                <div className="flex gap-4 mb-6">
                    <Skeleton className="h-12 flex-1 max-w-md" />
                    <Skeleton className="h-12 w-28" />
                </div>
                {viewMode === "kanban" ? (
                    <KanbanSkeleton />
                ) : (
                    <TableSkeleton rows={8} />
                )}
            </PageContainer>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen pb-16 pt-20">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center py-16">
                    <p className="text-error">Failed to load applications.</p>
                </div>
            </div>
        );
    }

    const pagination = response?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    };

return (
    <PageContainer maxWidth="xl" className="relative overflow-hidden">
      {/* Background Telemetry Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none select-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10">
        <PageHeader
          icon={Briefcase}
          title="Applications"
          description="Manage and track your job search progress."
          className="mb-12"
          actions={
            <div className="flex items-center gap-6">
              <ViewToggle value={viewMode} onChange={setViewMode} />
              <Link to="/app/applications/new">
                <Button size="lg" className="shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 active:scale-95">
                  <Plus className="w-5 h-5 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-12 gap-8 mb-16 items-end animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <div className="col-span-12 lg:col-span-8">
            <SearchBar
              value={filters.search}
              onChange={setSearch}
              placeholder="Search dossiers, companies, positions..."
              className="w-full"
            />
          </div>
          
          <div className="col-span-12 lg:col-span-4 flex justify-end gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setLocalLocation(filters.location);
                setLocalDateFrom(filters.appliedFrom);
                setLocalDateTo(filters.appliedTo);
                setLocalSalaryMin(filters.salaryMin?.toString() || "");
                setLocalSalaryMax(filters.salaryMax?.toString() || "");
                setFilterPanelOpen(true);
              }}
              className="border-outline-variant/50 hover:bg-surface-container-low hover:border-outline transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2 opacity-70" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 size-5 flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <FilterChips className="mb-10 min-h-8 animate-in fade-in delay-300 fill-mode-both">

                    {filters.search && (
                        <FilterChip
                            label="Search"
                            value={filters.search}
                            onRemove={() => setSearch("")}
                        />
                    )}
                    {filters.status.map((status) => (
                        <FilterChip
                            key={status}
                            label={APPLICATION_STATUS_CONFIG[status].label}
                            onRemove={() => handleRemoveStatus(status)}
                        />
                    ))}
                    {filters.location && (
                        <FilterChip
                            icon={<MapPin className="size-3" />}
                            label="Location"
                            value={filters.location}
                            onRemove={() => setLocationFilter("")}
                        />
                    )}
                    {(filters.appliedFrom || filters.appliedTo) && (
                        <FilterChip
                            icon={<Calendar className="size-3" />}
                            label="Date"
                            value={`${filters.appliedFrom || "..."} - ${filters.appliedTo || "..."}`}
                            onRemove={() => setDateRange("", "")}
                        />
                    )}
                    {(filters.salaryMin !== undefined || filters.salaryMax !== undefined) && (
                        <FilterChip
                            icon={<DollarSign className="size-3" />}
                            label="Salary"
                            value={`${filters.salaryMin || "0"} - ${filters.salaryMax || "∞"}`}
                            onRemove={() => setSalaryRange(undefined, undefined)}
                        />
                    )}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-on-surface-variant hover:text-primary underline"
                        >
                            Clear all
                        </button>
                    )}
                </FilterChips>

                {applications.length === 0 && activeFilterCount === 0 ? (
                    <EmptyState
                        icon="applications"
                        action={{
                            label: "Add Application",
                            onClick: () => navigate("/app/applications/new"),
                        }}
                        secondaryAction={{
                            label: "Browse Jobs",
                            href: "/",
                        }}
                    />
                ) : (
                    <div className="relative min-h-[400px]">
                        {viewMode === "kanban" ? (
                            <div key="kanban" className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 fill-mode-both">
                                <KanbanBoard
                                    applications={applications as Application[]}
                                    documentCounts={documentCounts || {}}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        ) : (
                            <div key="table" className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                                <TableView
                                    applications={applications as Application[]}
                                    pagination={pagination}
                                    sortField={sort}
                                    sortOrder={order as "asc" | "desc"}
                                    onSort={handleSort}
                                    onPageChange={setPage}
                                    selectedIds={selectedIds}
                                    onToggleSelect={handleToggleSelect}
                                    onSelectAll={handleSelectAll}
                                    totalFiltered={totalFiltered}
                                />
                            </div>
                        )}
                    </div>
                )}

            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-card border-outline rounded-xl shadow-lg">
                    <span className="text-sm font-medium text-on-surface">
                        {selectedIds.size} selected
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                            disabled={bulkUpdate.isPending}
                        >
                            Change Status
                        </Button>
                        {showStatusMenu && (
                            <div className="absolute bottom-full mb-2 left-0 flex flex-col gap-2 bg-card border-outline rounded-xl p-2 min-w-40 shadow-lg">
                                {APPLICATION_STATUSES.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleBulkStatusChange(status)}
                                        className="w-full px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                                    >
                                        {APPLICATION_STATUS_CONFIG[status].label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={bulkDelete.isPending}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedIds(new Set())}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50">
                    <div className="bg-card border-outline rounded-xl p-6 max-w-sm mx-4 shadow-lg">
                        <h3 className="text-lg font-semibold text-on-surface mb-2">
                            Delete {selectedIds.size} applications?
                        </h3>
                        <p className="text-on-surface-variant text-sm mb-4">
                            This action cannot be undone. All selected applications will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                disabled={bulkDelete.isPending}
                            >
                                {bulkDelete.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={filterPanelOpen} onOpenChange={setFilterPanelOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label>Status</Label>
                            <StatusFilterGroup
                                statuses={APPLICATION_STATUSES}
                                selectedStatuses={filters.status}
                                onToggle={handleToggleStatus}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={localLocation}
                                onChange={(e) => setLocalLocation(e.target.value)}
                                placeholder="City, state, or remote..."
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Applied Date Range</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="date"
                                    value={localDateFrom}
                                    onChange={(e) => setLocalDateFrom(e.target.value)}
                                    placeholder="From"
                                />
                                <span className="text-on-surface-variant">to</span>
                                <Input
                                    type="date"
                                    value={localDateTo}
                                    onChange={(e) => setLocalDateTo(e.target.value)}
                                    placeholder="To"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Salary Range</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={localSalaryMin}
                                    onChange={(e) => setLocalSalaryMin(e.target.value)}
                                    placeholder="Min"
                                />
                                <span className="text-on-surface-variant">to</span>
                                <Input
                                    type="number"
                                    value={localSalaryMax}
                                    onChange={(e) => setLocalSalaryMax(e.target.value)}
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClearAll}>
                            Clear All
                        </Button>
                        <Button onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </PageContainer>
    );
}
