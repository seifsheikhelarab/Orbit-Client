import { useState, useCallback } from "react";
import { Mail, Inbox, SearchX, RefreshCw, Loader2, ChevronRight } from "lucide-react";
import { PageContainer, PageHeader, Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGmailStatus, useGmailConnect, useInboxEntries } from "../api/useGmail";
import { format } from "date-fns";

type FilterTab = "all" | "matched" | "unmatched";

export default function InboxPage() {
    const [filter, setFilter] = useState<FilterTab>("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

    const { data: statusRes } = useGmailStatus();
    const connect = useGmailConnect();
    const { data: inboxRes, isLoading } = useInboxEntries({
        page,
        limit: 20,
        filter,
        search: search || undefined,
    });

    const status = statusRes?.data;
    const connected = !!(status?.connected && status?.isActive);
    const syncing = !!(status && status.syncProcessed < status.syncTotal && status.syncTotal > 0);
    const entries = inboxRes?.data ?? [];
    const pagination = inboxRes?.pagination;

    const handleFilterChange = useCallback((val: string) => {
        setFilter(val as FilterTab);
        setPage(1);
    }, []);

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                icon={Mail}
                title="Inbox"
                description="Job-related emails from your connected Gmail"
                actions={
                    connected ? (
                        <Badge variant="secondary" className="text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" />
                            Connected
                        </Badge>
                    ) : (
                        <Button size="sm" onClick={() => connect.mutate()} disabled={connect.isPending}>
                            <Mail className="w-4 h-4 mr-2" />
                            Connect Gmail
                        </Button>
                    )
                }
            />

            {/* Sync Banner */}
            {syncing && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-on-surface">Syncing Gmail...</p>
                        <p className="text-xs text-on-surface-variant">
                            {status!.syncProcessed} of {status!.syncTotal} emails processed
                        </p>
                    </div>
                    <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(status!.syncProcessed / status!.syncTotal) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {!connected ? (
                /* Empty State: Not Connected */
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
                            <Mail className="w-8 h-8 text-on-surface-variant/50" />
                        </div>
                        <h3 className="text-xl font-bold text-on-surface mb-2">Connect your Gmail</h3>
                        <p className="text-sm text-on-surface-variant max-w-sm mb-6">
                            Link your Gmail account to automatically track job-related emails, interview invitations, and application confirmations.
                        </p>
                        <Button onClick={() => connect.mutate()} disabled={connect.isPending}>
                            <Mail className="w-4 h-4 mr-2" />
                            Connect Gmail
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Filter Tabs + Search */}
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <Tabs value={filter} onValueChange={handleFilterChange}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="matched">Matched</TabsTrigger>
                                <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Input
                                placeholder="Search emails..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9 h-9"
                            />
                            <SearchX className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 pointer-events-none" />
                        </div>
                    </div>

                    {/* Email List */}
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-16 rounded-xl bg-surface-container-low animate-pulse" />
                            ))}
                        </div>
                    ) : entries.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                                    {filter !== "all" ? (
                                        <SearchX className="w-6 h-6 text-on-surface-variant/50" />
                                    ) : (
                                        <Inbox className="w-6 h-6 text-on-surface-variant/50" />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-on-surface mb-1">
                                    {filter !== "all" ? "No matching emails" : "No emails yet"}
                                </h3>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    {filter !== "all"
                                        ? "Try a different filter or link emails manually."
                                        : "No job-related emails found in the last 7 days."}
                                </p>
                                {filter !== "all" ? (
                                    <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
                                        Show All
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => connect.mutate()}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Re-sync
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-1">
                            {entries.map((entry) => (
                                <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => setSelectedEntryId(selectedEntryId === entry.id ? null : entry.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-150 flex items-center gap-4 group ${
                                        selectedEntryId === entry.id
                                            ? "bg-primary/5 border border-primary/20"
                                            : "hover:bg-surface-container-low border border-transparent"
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${entry.matched ? "bg-success" : "bg-outline"}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-on-surface truncate">{entry.subject}</p>
                                            {entry.parseFailed && (
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">parse error</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-on-surface-variant truncate">
                                            {entry.senderName || entry.sender}
                                            {entry.snippet && <span className="opacity-60"> — {entry.snippet}</span>}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {entry.application ? (
                                            <Badge variant="secondary" className="text-xs">
                                                {entry.application.company}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs text-on-surface-variant/60">
                                                Unmatched
                                            </Badge>
                                        )}
                                        <span className="text-xs text-on-surface-variant/60 hidden sm:block">
                                            {format(new Date(entry.receivedAt), "MMM d")}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-on-surface-variant/40 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline">
                            <p className="text-xs text-on-surface-variant">
                                {pagination.total} emails total
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-xs text-on-surface-variant font-medium px-2">
                                    {page} / {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= pagination.totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </PageContainer>
    );
}
