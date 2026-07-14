import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, FileText, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes, useAttachResume, type Resume } from "@/features/cv-builder/api/useResumes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AttachResumePage() {
    const { id: applicationId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: resumesResponse, isLoading } = useResumes(1, 50);
    const attachResume = useAttachResume();

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Resume | null>(null);

    const resumes = resumesResponse?.data || [];
    const filtered = resumes.filter((r: Resume) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAttach = async () => {
        if (!selected || !applicationId) return;
        try {
            await attachResume.mutateAsync({ resumeId: selected.id, applicationId });
            toast.success(`"${selected.name}" attached successfully`);
            navigate(`/app/applications/${applicationId}`);
        } catch {
            toast.error("Failed to attach resume");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-16 bg-background">
                <div className="max-w-2xl mx-auto p-8 animate-in fade-in duration-700">
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-5 w-72 mb-12" />
                    <div className="relative mb-8">
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="grid gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface-container-low/50">
                                <Skeleton className="size-11 rounded-xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 relative overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none select-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-2xl mx-auto p-8 relative z-10">
                <div className="flex items-center gap-5 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/app/applications/${applicationId}`)}
                        className="size-11 rounded-xl hover:bg-surface-container-high active:scale-90 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Attach Document</h1>
                        <p className="text-on-surface-variant font-medium">Select a resume or cover letter for this application.</p>
                    </div>
                </div>

                <div className="relative mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                    <Input
                        placeholder="Search by document name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-14 bg-surface-container-low border-outline-variant/50 focus:border-primary transition-all rounded-xl"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-outline-variant/50 rounded-3xl bg-surface-container-low/30 animate-in fade-in zoom-in-95 duration-500 delay-200 fill-mode-both">
                        <FileText className="w-16 h-16 mx-auto mb-6 text-on-surface-variant/20" />
                        <p className="text-on-surface-variant font-medium mb-6">No matching documents found</p>
                        <Button variant="outline" asChild className="rounded-xl px-8 border-outline hover:bg-surface-container transition-all">
                            <Link to="/app/resumes">Create New Entry</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                        {filtered.map((resume: Resume, index: number) => (
                            <button
                                type="button"
                                key={resume.id}
                                onClick={() => setSelected(resume)}
                                className={cn(
                                    "flex items-center gap-5 p-5 rounded-2xl border text-left transition-all duration-300",
                                    "animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
                                    selected?.id === resume.id
                                        ? "border-primary bg-primary-fixed shadow-lg shadow-primary/5 -translate-y-1"
                                        : "border-outline-variant/50 hover:border-primary/30 bg-surface-container-low hover:bg-surface-container"
                                )}
                                style={{ animationDelay: `${200 + index * 50}ms` }}
                            >
                                <div className={cn(
                                    "p-3 rounded-xl transition-colors duration-300",
                                    selected?.id === resume.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant/70"
                                )}>
                                    {resume.type === "COVER_LETTER" ? <Mail className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-headline font-bold text-on-surface text-lg leading-tight truncate">{resume.name}</p>
                                    <p className="text-xs font-bold tracking-widest text-on-surface-variant/60 mt-1">{resume.type.replace("_", " ")}</p>
                                </div>
                                {selected?.id === resume.id && (
                                    <div className="p-2 rounded-full bg-primary text-on-primary animate-in zoom-in duration-300"><Check className="w-4 h-4" /></div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {selected && (
                    <div className="fixed bottom-8 inset-x-8 max-w-2xl mx-auto z-50 animate-in slide-in-from-bottom-12 fade-in duration-500 fill-mode-both">
                        <Button 
                            onClick={handleAttach} 
                            disabled={attachResume.isPending} 
                            className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 transition-transform active:scale-[0.98]"
                        >
                            {attachResume.isPending ? "Syncing..." : `Attach "${selected.name}"`}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
