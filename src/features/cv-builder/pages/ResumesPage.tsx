import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Copy, Edit, Eye, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useResumes, useDeleteResume, useCreateResume, type Resume } from "../api/useResumes";
import { defaultResumeData, defaultCoverLetterContent, type ResumeType } from "../types";

export function ResumesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ResumeType>("RESUME");
    const { data: response, isLoading, isError } = useResumes(1, 50, activeTab);
    const deleteResume = useDeleteResume();
    const createResume = useCreateResume();
    const [isCreating, setIsCreating] = useState(false);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                await deleteResume.mutateAsync(id);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCreate = (type: ResumeType) => {
        setIsCreating(true);
        const data = type === "RESUME"
            ? { name: "Untitled Resume", content: defaultResumeData, settings: defaultResumeData.settings }
            : { name: "Untitled Cover Letter", type, content: defaultCoverLetterContent, settings: {} };
        
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
                <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-error">Failed to load documents.</p>
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
                    {/* Editorial Resume Preview */}
                    <div className="absolute inset-4 rounded-lg bg-surface shadow-sm border border-outline-variant/30 overflow-hidden">
                        {/* Header area */}
                        <div className="h-8 bg-primary/10 border-b border-outline-variant/20 flex items-center px-3">
                            <div className="w-16 h-2 rounded-full bg-primary/30" />
                        </div>
                        {/* Content lines - resume preview mockup */}
                        <div className="p-4 space-y-2">
                            <div className="h-3 w-3/4 rounded-full bg-on-surface/10" />
                            <div className="h-2 w-1/2 rounded-full bg-on-surface/5" />
                            <div className="h-2 w-2/3 rounded-full bg-on-surface/5" />
                            <div className="mt-3 space-y-1.5">
                                <div className="h-1.5 w-full rounded-full bg-on-surface/5" />
                                <div className="h-1.5 w-full rounded-full bg-on-surface/5" />
                                <div className="h-1.5 w-3/4 rounded-full bg-on-surface/5" />
                            </div>
                            <div className="mt-3 pt-3 border-t border-outline-variant/20">
                                <div className="h-2 w-20 rounded-full bg-accent/20" />
                                <div className="mt-2 space-y-1">
                                    <div className="h-1.5 w-full rounded-full bg-on-surface/5" />
                                    <div className="h-1.5 w-5/6 rounded-full bg-on-surface/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-surface shadow-sm border border-outline-variant/30">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                            {item.type === "COVER_LETTER" ? "CL" : "CV"}
                        </span>
                    </div>
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
                <Button variant="ghost" size="sm" onClick={(e) => handleDelete(item.id, e)} className="text-xs text-error" aria-label={`Delete ${item.name}`}>
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
                    <button 
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
        </PageContainer>
    );
}