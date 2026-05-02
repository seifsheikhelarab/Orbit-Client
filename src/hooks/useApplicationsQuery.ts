import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ApplicationStatus } from "@/features/applications/api/useApplications";

export interface FilterState {
    search: string;
    status: ApplicationStatus[];
    location: string;
    appliedFrom: string;
    appliedTo: string;
    salaryMin: number | undefined;
    salaryMax: number | undefined;
}

export interface QueryParams extends FilterState {
    page: number;
    limit: number;
    sort: string;
    order: string;
}

export function useApplicationsQuery(defaultLimit = 20) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<
        typeof setTimeout
    > | null>(null);

    const filters = useMemo<FilterState>(() => {
        const statusParam = searchParams.get("status");
        return {
            search: debouncedSearch || searchParams.get("search") || "",
            status: statusParam
                ? (statusParam
                      .split(",")
                      .filter(Boolean) as ApplicationStatus[])
                : [],
            location: searchParams.get("location") || "",
            appliedFrom: searchParams.get("applied_from") || "",
            appliedTo: searchParams.get("applied_to") || "",
            salaryMin: searchParams.get("salary_min")
                ? Number(searchParams.get("salary_min"))
                : undefined,
            salaryMax: searchParams.get("salary_max")
                ? Number(searchParams.get("salary_max"))
                : undefined
        };
    }, [searchParams, debouncedSearch]);

    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const setSearch = useCallback(
        (value: string) => {
            if (debounceTimer) clearTimeout(debounceTimer);
            const timer = setTimeout(() => {
                setDebouncedSearch(value);
                setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    if (value) {
                        newParams.set("search", value);
                    } else {
                        newParams.delete("search");
                    }
                    newParams.delete("page");
                    return newParams;
                });
            }, 300);
            setDebounceTimer(timer);
        },
        [debounceTimer, setSearchParams]
    );

    const setStatusFilter = useCallback(
        (statuses: ApplicationStatus[]) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (statuses.length > 0) {
                    newParams.set("status", statuses.join(","));
                } else {
                    newParams.delete("status");
                }
                newParams.delete("page");
                return newParams;
            });
        },
        [setSearchParams]
    );

    const setLocationFilter = useCallback(
        (value: string) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (value) {
                    newParams.set("location", value);
                } else {
                    newParams.delete("location");
                }
                newParams.delete("page");
                return newParams;
            });
        },
        [setSearchParams]
    );

    const setDateRange = useCallback(
        (from: string, to: string) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (from) {
                    newParams.set("applied_from", from);
                } else {
                    newParams.delete("applied_from");
                }
                if (to) {
                    newParams.set("applied_to", to);
                } else {
                    newParams.delete("applied_to");
                }
                newParams.delete("page");
                return newParams;
            });
        },
        [setSearchParams]
    );

    const setSalaryRange = useCallback(
        (min: number | undefined, max: number | undefined) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (min !== undefined) {
                    newParams.set("salary_min", String(min));
                } else {
                    newParams.delete("salary_min");
                }
                if (max !== undefined) {
                    newParams.set("salary_max", String(max));
                } else {
                    newParams.delete("salary_max");
                }
                newParams.delete("page");
                return newParams;
            });
        },
        [setSearchParams]
    );

    const setPage = useCallback(
        (newPage: number) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set("page", String(newPage));
                return newParams;
            });
        },
        [setSearchParams]
    );

    const setSortParams = useCallback(
        (newSort: string, newOrder: string) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set("sort", newSort);
                newParams.set("order", newOrder);
                return newParams;
            });
        },
        [setSearchParams]
    );

    const clearFilters = useCallback(() => {
        setDebouncedSearch("");
        setSearchParams((prev) => {
            const newParams = new URLSearchParams();
            const view = prev.get("view");
            if (view) newParams.set("view", view);
            return newParams;
        });
    }, [setSearchParams]);

    const getQueryParams = useCallback(
        (currentPage: number = page): QueryParams => ({
            ...filters,
            page: currentPage,
            limit: defaultLimit,
            sort,
            order
        }),
        [filters, page, sort, order, defaultLimit]
    );

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.status.length > 0) count++;
        if (filters.location) count++;
        if (filters.appliedFrom || filters.appliedTo) count++;
        if (filters.salaryMin !== undefined || filters.salaryMax !== undefined)
            count++;
        return count;
    }, [filters]);

    return {
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
    };
}
