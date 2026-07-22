import { useState, useEffect, useCallback } from "react";
import { X, ExternalLink, Link2, Unlink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInboxEntry, useLinkInboxEntry, useUnlinkInboxEntry } from "../api/useGmail";
import { useApplications } from "@/features/applications/api/useApplications";
import { format } from "date-fns";

interface InboxDetailPanelProps {
    entryId: string | null;
    onClose: () => void;
}

export function InboxDetailPanel({ entryId, onClose }: InboxDetailPanelProps) {
    const { data: entryRes, isLoading } = useInboxEntry(entryId);
    const entry = entryRes?.data;

    const linkEntry = useLinkInboxEntry(entryId ?? "");
    const unlinkEntry = useUnlinkInboxEntry(entryId ?? "");

    const [searchQuery, setSearchQuery] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const { data: appsRes } = useApplications({
        page: 1,
        limit: 100,
        search: searchQuery,
        status: [],
        location: "",
        appliedFrom: "",
        appliedTo: "",
        sort: "createdAt",
        order: "desc",
    });
    const applications = appsRes?.data ?? [];

    useEffect(() => {
        if (entryId) {
            setSearchQuery("");
            setShowPicker(false);
        }
    }, [entryId]);

    const handleLink = useCallback(async (appId: string) => {
        await linkEntry.mutateAsync(appId);
        setShowPicker(false);
    }, [linkEntry]);

    const handleUnlink = useCallback(async () => {
        await unlinkEntry.mutateAsync();
    }, [unlinkEntry]);

    if (!entryId) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-on-surface/10 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-surface z-50 shadow-2xl border-l border-outline animate-in slide-in-from-right duration-200">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-outline">
                        <h2 className="text-lg font-bold text-on-surface truncate pr-4">
                            {isLoading ? "Loading..." : entry?.subject ?? "Email"}
                        </h2>
                        <Button variant="ghost" size="icon-sm" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        ) : entry ? (
                            <>
                                {/* Meta */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-on-surface">From:</span>
                                        <span className="text-on-surface-variant">
                                            {entry.senderName ? `${entry.senderName} <${entry.sender}>` : entry.sender}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-on-surface">Date:</span>
                                        <span className="text-on-surface-variant">
                                            {format(new Date(entry.receivedAt), "MMMM d, yyyy 'at' h:mm a")}
                                        </span>
                                    </div>
                                    {entry.extractedIntent && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-on-surface">Intent:</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {entry.extractedIntent.replace(/_/g, " ")}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Gemini Summary */}
                                {entry.extractedSummary && (
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                                        <p className="text-xs font-bold text-primary tracking-wider uppercase">AI Summary</p>
                                        <p className="text-sm text-on-surface leading-relaxed">{entry.extractedSummary}</p>
                                    </div>
                                )}

                                {/* Snippet / Body Preview */}
                                {entry.snippet && (
                                    <div className="p-4 bg-surface-container-low rounded-xl">
                                        <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Preview</p>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">{entry.snippet}</p>
                                    </div>
                                )}

                                {/* Extracted Info */}
                                {(entry.extractedCompany || entry.extractedJobTitle) && (
                                    <div className="p-4 bg-surface-container rounded-xl space-y-1">
                                        <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Extracted Info</p>
                                        {entry.extractedCompany && (
                                            <p className="text-sm text-on-surface">Company: <span className="font-bold">{entry.extractedCompany}</span></p>
                                        )}
                                        {entry.extractedJobTitle && (
                                            <p className="text-sm text-on-surface">Role: <span className="font-bold">{entry.extractedJobTitle}</span></p>
                                        )}
                                    </div>
                                )}

                                {/* Linked Application */}
                                <div className="border-t border-outline pt-5">
                                    <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-3">
                                        {entry.matched ? "Linked Application" : "Link to Application"}
                                    </p>

                                    {entry.matched && entry.application ? (
                                        <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl">
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-on-surface truncate">{entry.application.company}</p>
                                                <p className="text-xs text-on-surface-variant truncate">{entry.application.jobTitle}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleUnlink}
                                                disabled={unlinkEntry.isPending}
                                                className="text-error hover:text-error shrink-0"
                                            >
                                                <Unlink className="w-4 h-4 mr-1" />
                                                Unlink
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {!showPicker ? (
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => setShowPicker(true)}
                                                >
                                                    <Link2 className="w-4 h-4 mr-2" />
                                                    Link to Application
                                                </Button>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Search applications..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="pl-9 h-9"
                                                            autoFocus
                                                        />
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 pointer-events-none" />
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto border border-outline rounded-xl divide-y divide-outline">
                                                        {applications.length === 0 ? (
                                                            <p className="text-xs text-on-surface-variant text-center py-4">
                                                                No applications found
                                                            </p>
                                                        ) : (
                                                            applications.map((app) => (
                                                                <button
                                                                    key={app.id}
                                                                    type="button"
                                                                    onClick={() => handleLink(app.id)}
                                                                    disabled={linkEntry.isPending}
                                                                    className="w-full text-left px-3 py-2.5 hover:bg-surface-container-low transition-colors flex items-center gap-3"
                                                                >
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-sm font-bold text-on-surface truncate">{app.company}</p>
                                                                        <p className="text-xs text-on-surface-variant truncate">{app.jobTitle}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-[10px] shrink-0">
                                                                        {app.applicationStatus.replace(/_/g, " ")}
                                                                    </Badge>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Raw Email Link */}
                                {entry.gmailMessageId && (
                                    <a
                                        href={`https://mail.google.com/mail/u/0/#inbox/${entry.gmailMessageId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View in Gmail
                                    </a>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
