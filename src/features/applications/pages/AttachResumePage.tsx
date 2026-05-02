import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, FileText, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes, useAttachResume, type Resume } from "@/features/cv-builder/api/useResumes";
import { toast } from "sonner";

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
            <div className="min-h-screen pt-16">
                <div className="max-w-2xl mx-auto p-8">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="grid gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16">
            <div className="max-w-2xl mx-auto p-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/app/applications/${applicationId}`)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-headline font-semibold text-on-surface">Attach Document</h1>
                        <p className="text-sm text-on-surface-variant">Select a resume or cover letter for this application</p>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-foreground/10 rounded-2xl">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-foreground/20" />
                        <p className="text-on-surface-variant mb-4">No documents found</p>
                        <Button variant="outline" asChild>
                            <Link to="/app/resumes">Create a Document</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filtered.map((resume: Resume) => (
                            <button
                                key={resume.id}
                                onClick={() => setSelected(resume)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                                    selected?.id === resume.id
                                        ? "border-primary bg-primary/5"
                                        : "border-foreground/10 hover:border-foreground/20 bg-foreground/5"
                                }`}
                            >
                                <div className={`p-2 rounded-xl ${selected?.id === resume.id ? "bg-primary text-on-primary" : "bg-surface-container"}`}>
                                    {resume.type === "COVER_LETTER" ? <Mail className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-0">
                                    <p className="font-medium text-on-surface">{resume.name}</p>
                                    <p className="text-xs text-on-surface-variant capitalize">{resume.type.replace("_", " ")}</p>
                                </div>
                                {selected?.id === resume.id && (
                                    <div className="p-2 rounded-full bg-primary text-white"><Check className="w-4 h-4" /></div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {selected && (
                    <div className="fixed bottom-6 inset-x-6 max-w-2xl mx-auto">
                        <Button onClick={handleAttach} disabled={attachResume.isPending} className="w-full h-14 text-base shadow-2xl shadow-primary/20">
                            {attachResume.isPending ? "Attaching..." : `Attach "${selected.name}"`}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
