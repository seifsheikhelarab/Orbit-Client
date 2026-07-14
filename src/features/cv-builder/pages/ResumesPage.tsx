import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Copy, Edit, Eye, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, ConfirmDialog } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useResumes, useDeleteResume, useCreateResume, type Resume } from "../api/useResumes";
import { StickerSheet } from "../components/StickerSheet";
import { defaultResumeData, defaultCoverLetterContent, type ResumeType } from "../types";

export function ResumesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ResumeType>("RESUME");
    const { data: response, isLoading, isError } = useResumes(1, 50, activeTab);
    const deleteResume = useDeleteResume();
    const createResume = useCreateResume();
    const [isCreating, setIsCreating] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteResume.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = (type: ResumeType) => {
        setIsCreating(true);
        const data = type === "RESUME"
            ? {
                name: "Untitled Resume",
                content: defaultResumeData as unknown as Record<string, unknown>,
                settings: defaultResumeData.settings as unknown as Record<string, unknown>,
            }
            : {
                name: "Untitled Cover Letter",
                type,
                content: defaultCoverLetterContent as unknown as Record<string, unknown>,
                settings: {} as Record<string, unknown>,
            };

        createResume.mutate(data, {
            onSuccess: (res) => {
                if (res?.data?.id) navigate(`/app/resumes/${res.data.id}`);
                setIsCreating(false);
            },
            onError: () => setIsCreating(false)
        });
    };

    const handleDuplicate = (resume: Resume, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCreating(true);
        createResume.mutate({
            name: `${resume.name} (Copy)`,
            type: resume.type as ResumeType,
            content: resume.content,
            settings: resume.settings
        }, {
            onSuccess: (res) => {
                if (res?.data?.id) navigate(`/app/resumes/${res.data.id}`);
                setIsCreating(false);
            },
            onError: () => setIsCreating(false)
        });
    };

    if (isLoading) {
        return (
            <PageContainer maxWidth="xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-14 rounded-xl" />
                        <div><Skeleton className="h-10 w-48 mb-2" /><Skeleton className="h-5 w-72" /></div>
                    </div>
                    <Skeleton className="h-11 w-40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
                </div>
            </PageContainer>
        );
    }

    if (isError) {
        return (
            <PageContainer maxWidth="xl">
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <p className="text-on-surface">Failed to load documents. Check your connection and try again.</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const items = response?.data || [];

    const renderCard = (item: Resume, index: number) => (
        <div 
            key={item.id} 
            className={cn(
                "group flex flex-col bg-surface rounded-xl border border-outline shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
                "animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <Link to={`/app/resumes/${item.id}`} className="flex flex-col h-full">
                <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
                    <StickerSheet
                        type={item.type}
                        content={item.content}
                        settings={item.settings}
                        name={item.name}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <div className="bg-primary text-on-primary p-2.5 rounded-full hover:bg-primary-hover transition-colors" aria-label="Edit resume" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <Edit className="w-4 h-4" />
                        </div>
                        <div className="bg-surface text-on-surface p-2.5 rounded-full hover:bg-surface-container-low transition-colors" aria-label="Preview resume" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <Eye className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </Link>
            <div className="p-5 flex flex-col gap-1">
                <p className="text-on-surface text-base font-medium leading-tight line-clamp-1">{item.name}</p>
                <p className="text-muted-foreground text-xs">
                    {item.type === "COVER_LETTER" ? "Cover Letter" : "Resume"} · {new Date(item.updatedAt).toLocaleDateString()}
                </p>
            </div>
            <div className="justify-between pt-3 px-5 pb-5 border-t border-outline bg-surface-container-low flex">
                <Button variant="ghost" size="sm" onClick={(e) => handleDuplicate(item, e)} disabled={isCreating} className="text-xs" aria-label={`Duplicate ${item.name}`}>
                    <Copy className="w-3 h-3 mr-1" />Duplicate
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget({ id: item.id, name: item.name }); }} className="text-xs text-error" aria-label={`Delete ${item.name}`}>
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                icon={FileText}
                title="My Documents"
                description="Manage resumes and cover letters for your job applications."
                actions={
                    <Button onClick={() => handleCreate(activeTab)} disabled={isCreating}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create {activeTab === "RESUME" ? "Resume" : "Cover Letter"}
                    </Button>
                }
            />

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResumeType)} className="mb-8">
                <TabsList>
                    <TabsTrigger value="RESUME" className="gap-2">
                        <FileText className="w-4 h-4" />Resumes
                    </TabsTrigger>
                    <TabsTrigger value="COVER_LETTER" className="gap-2">
                        <Mail className="w-4 h-4" />Cover Letters
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {items.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-outline rounded-xl bg-surface-container-low animate-in fade-in zoom-in-95 duration-500">
                    {activeTab === "RESUME" ? (
                        <FileText className="w-16 h-16 mx-auto mb-4 text-outline" />
                    ) : (
                        <Mail className="w-16 h-16 mx-auto mb-4 text-outline" />
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-on-surface">No {activeTab === "RESUME" ? "resumes" : "cover letters"} yet</h3>
                    <p className="text-on-surface-variant mb-6 max-w-sm mx-auto">
                        {activeTab === "RESUME" ? "Create your first resume to start applying to jobs" : "Create your first cover letter to personalize your applications"}
                    </p>
                    <Button onClick={() => handleCreate(activeTab)} disabled={isCreating}>
                        Create {activeTab === "RESUME" ? "Resume" : "Cover Letter"}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item, index) => renderCard(item, index))}
                    <button type="button"
                        onClick={() => handleCreate(activeTab)}
                        disabled={isCreating}
                        className={cn(
                            "group flex flex-col items-center justify-center gap-4 bg-surface-container-low rounded-xl border-2 border-dashed border-outline hover:border-primary hover:bg-surface-container transition-all aspect-3/4",
                            "animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                        )}
                        style={{ animationDelay: `${items.length * 50}ms` }}
                    >
                        <div className="size-16 rounded-full bg-surface-container flex items-center justify-center text-muted-foreground transition-all group-hover:scale-110 group-hover:bg-accent-fixed-dim group-hover:text-accent">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-on-surface text-base font-medium">New {activeTab === "RESUME" ? "Resume" : "Cover Letter"}</p>
                            <p className="text-muted-foreground text-xs font-medium">Start from scratch</p>
                        </div>
                    </button>
                </div>
            )}
            {deleteTarget && (
                <ConfirmDialog
                    open={!!deleteTarget}
                    onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                    title="Delete document"
                    description={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    variant="destructive"
                    onConfirm={handleDelete}
                    isPending={deleteResume.isPending}
                />
            )}
        </PageContainer>
    );
}