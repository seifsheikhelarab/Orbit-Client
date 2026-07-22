import { Mail, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGmailStatus, useGmailConnect, useGmailDisconnect, useGmailResync } from "@/features/gmail/api/useGmail";
import { format } from "date-fns";

export function GmailCard() {
    const { data: statusRes, isLoading } = useGmailStatus();
    const connect = useGmailConnect();
    const disconnect = useGmailDisconnect();
    const resync = useGmailResync();

    const status = statusRes?.data;
    const connected = !!(status?.connected && status?.isActive);
    const syncing = !!(status && status.syncProcessed < status.syncTotal && status.syncTotal > 0);

    return (
        <Card className="border border-outline shadow-sm overflow-hidden">
            <CardHeader className="bg-surface-container border-b border-outline-variant p-6 flex flex-row items-center gap-4">
                <div className="p-2.5 bg-primary text-on-primary rounded-lg shrink-0">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle>Gmail Integration</CardTitle>
                    <CardDescription className="text-xs font-medium text-on-surface-variant">
                        Connect your Gmail to auto-track job-related emails
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {isLoading ? (
                    <div className="h-11 bg-surface-container rounded-xl animate-pulse" />
                ) : connected ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-xl">
                            <div className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-on-surface">Connected</p>
                                {status?.lastSyncAt && (
                                    <p className="text-xs text-on-surface-variant">
                                        Last synced: {format(new Date(status.lastSyncAt), "MMM d, yyyy h:mm a")}
                                    </p>
                                )}
                                {syncing && (
                                    <p className="text-xs text-primary font-medium mt-1">
                                        Syncing... {status.syncProcessed}/{status.syncTotal} emails
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resync.mutate()}
                                disabled={resync.isPending || syncing}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                                Re-sync
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => disconnect.mutate()}
                                disabled={disconnect.isPending}
                                className="text-error hover:text-error hover:bg-error-container"
                            >
                                <Unplug className="w-4 h-4 mr-2" />
                                Disconnect
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant">
                            <div className="w-2.5 h-2.5 rounded-full bg-outline shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-on-surface">Not connected</p>
                                <p className="text-xs text-on-surface-variant">
                                    Link your Gmail to automatically track job-related emails
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => connect.mutate()}
                            disabled={connect.isPending}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Connect Gmail
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
