import { useState } from "react";
import { useAutoCV, useSaveAutoCV } from "../api/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    Loader2, Sparkles, Wand2, FileText, CheckCircle2, 
    Briefcase, MapPin, DollarSign, ArrowRight, History,
    ShieldCheck, Zap, Layers
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components/ui";
import { Label } from "@/components/ui/label";

export default function AutoCVPage() {
    const [jobDescription, setJobDescription] = useState("");
    const generate = useAutoCV();
    const save = useSaveAutoCV();
    const navigate = useNavigate();

    const [result, setResult] = useState<any>(null);
    const [activeDoc, setActiveDoc] = useState<"resume" | "coverLetter">("resume");

    const handleGenerate = async () => {
        if (!jobDescription.trim()) return toast.error("Please provide a job description");
        try {
            const data = await generate.mutateAsync(jobDescription);
            setResult(data);
            toast.success("AI Synthesis complete!");
        } catch (error) {
            toast.error("Synthesis failed. Verify your professional dossier is complete.");
        }
    };

    const handleSave = async () => {
        try {
            const saved = await save.mutateAsync(result);
            toast.success("Dossier finalized and application created!");
            navigate(`/app/applications/${saved.application.id}`);
        } catch (error) {
            toast.error("Failed to finalize application");
        }
    };

    return (
        <PageContainer maxWidth="xl" className="pb-24 relative overflow-hidden">
            {/* Background Telemetry Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none select-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            </div>

            <PageHeader
                icon={Sparkles}
                title="AutoCV Synthesis"
                description="Harness GenAI to tailor your professional presence to specific job requirements."
                className="mb-16"
            />

            {!result ? (
                <div className="max-w-4xl mx-auto stagger-children">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Input Area */}
                        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="p-10 rounded-[48px] bg-surface-container-low/40 border border-outline-variant/10 shadow-2xl shadow-primary/5 relative group transition-all hover:bg-surface-container-low/60">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-label-sm font-black text-primary uppercase tracking-[0.2em]">Target Intel</Label>
                                        <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">Job Description / Requirements</span>
                                    </div>
                                    <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent animate-icon-float">
                                        <Layers className="size-6" />
                                    </div>
                                </div>

                                <Textarea 
                                    placeholder="Paste the full job description or requirements dossier here..."
                                    className="min-h-[400px] bg-surface/50 border-none rounded-[32px] p-8 text-body-md leading-relaxed focus-visible:ring-2 ring-primary/5 shadow-inner resize-none transition-all"
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                />
                                
                                <div className="mt-10">
                                    <Button 
                                        className="w-full py-10 rounded-[32px] bg-primary text-on-primary font-bold text-lg shadow-2xl shadow-primary/30 group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden"
                                        onClick={handleGenerate}
                                        disabled={generate.isPending}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-on-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        {generate.isPending ? (
                                            <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                        ) : (
                                            <Wand2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                                        )}
                                        {generate.isPending ? "Synthesizing Dossier..." : "Begin AI Tailoring"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
                            <div className="p-8 rounded-[40px] bg-linear-to-br from-surface-container-low to-surface border border-outline-variant/10 space-y-8">
                                <h3 className="text-title-md font-bold text-on-surface">How it works</h3>
                                
                                <div className="space-y-6">
                                    <FeatureItem 
                                        icon={<Zap />} 
                                        title="Keyword Mapping" 
                                        desc="Extracts critical skills and terminology from the job description." 
                                    />
                                    <FeatureItem 
                                        icon={<ShieldCheck />} 
                                        title="Dossier Alignment" 
                                        desc="Syncs your experience with the employer's specific needs." 
                                    />
                                    <FeatureItem 
                                        icon={<History />} 
                                        title="Auto-Capture" 
                                        desc="Automatically creates a tracked application in your pipeline." 
                                    />
                                </div>

                                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-normal">
                                        Optimization Level: High
                                    </p>
                                    <p className="text-xs text-on-surface-variant/70 mt-2 font-medium">
                                        Tailored content is generated specifically for this role while preserving your authentic professional voice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="p-10 rounded-[48px] bg-surface-container border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                <Sparkles className="size-24" />
                            </div>

                            <div className="space-y-2 relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Extracted Intel</span>
                                <h3 className="text-2xl font-black text-on-surface leading-tight font-headline">{result.jobData.jobTitle}</h3>
                                <p className="text-on-surface-variant font-bold text-sm">{result.jobData.company}</p>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-outline-variant/20 relative z-10">
                                <IntelItem icon={<MapPin />} label="Target Location" value={result.jobData.location} />
                                <IntelItem icon={<Briefcase />} label="Record Type" value="Auto-Synthesized" />
                                <IntelItem icon={<DollarSign />} label="Salary Range" value={result.jobData.salaryMin ? `$${result.jobData.salaryMin.toLocaleString()} - $${result.jobData.salaryMax.toLocaleString()}` : "Confidential"} />
                            </div>

                            <div className="pt-4 space-y-3 relative z-10">
                                <Button 
                                    className="w-full py-8 rounded-[28px] bg-primary text-on-primary font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                    onClick={handleSave}
                                    disabled={save.isPending}
                                >
                                    {save.isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-3" />}
                                    Finalize & Apply
                                </Button>
                                
                                <Button variant="ghost" className="w-full py-6 rounded-2xl text-xs font-bold text-on-surface-variant/60 hover:text-error hover:bg-error/5 transition-all" onClick={() => setResult(null)}>
                                    Discard Synthesis
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <div className="p-10 rounded-[48px] bg-surface-container-low/50 border border-outline-variant/10 space-y-10 min-h-[600px]">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4 p-1.5 bg-surface-container rounded-2xl border border-outline-variant/10 shadow-inner">
                                    <TabButton active={activeDoc === "resume"} onClick={() => setActiveDoc("resume")} label="Synthesized Resume" icon={<FileText />} />
                                    <TabButton active={activeDoc === "coverLetter"} onClick={() => setActiveDoc("coverLetter")} label="Tailored Cover Letter" icon={<FileText />} />
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                                    <Zap className="size-3" />
                                    Optimized for ATS
                                </div>
                            </div>
                            
                            <div className="space-y-10 animate-in fade-in duration-1000">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <Wand2 className="size-4" />
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface">Synthesis Insight</h4>
                                    </div>
                                    {activeDoc === "resume" ? (
                                        <p className="text-body-md text-on-surface-variant leading-relaxed italic">
                                            "The professional summary has been re-engineered to emphasize your expertise in <strong>{result.jobData.jobTitle}</strong>, directly aligning with <strong>{result.jobData.company}'s</strong> stated requirements for this role."
                                        </p>
                                    ) : (
                                        <p className="text-body-md text-on-surface-variant leading-relaxed italic">
                                            "The cover letter has been crafted to demonstrate genuine enthusiasm for <strong>{result.jobData.company}</strong> while highlighting your most relevant qualifications for the <strong>{result.jobData.jobTitle}</strong> position."
                                        </p>
                                    )}
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-linear-to-r from-primary/5 via-accent/5 to-primary/5 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                    {activeDoc === "resume" ? (
                                        <div className="relative p-10 rounded-[32px] bg-surface border border-outline-variant/30 shadow-2xl shadow-primary/5 font-body leading-relaxed text-on-surface">
                                            <div className="h-4 w-48 bg-primary/10 rounded-full mb-8 animate-pulse" />
                                            <p className="text-lg font-bold mb-6 text-primary">Tailored Professional Summary</p>
                                            <p className="text-on-surface-variant leading-relaxed">
                                                {result.tailoredContent.resumeContent.basics.summary}
                                            </p>
                                            <div className="mt-12 pt-8 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-on-surface-variant/40">
                                                <span>Full dossier available in Builder after finalization</span>
                                                <ArrowRight className="size-4" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative p-10 rounded-[32px] bg-surface border border-outline-variant/30 shadow-2xl shadow-primary/5 font-body leading-relaxed text-on-surface">
                                            <div className="h-4 w-48 bg-primary/10 rounded-full mb-8 animate-pulse" />
                                            <p className="text-lg font-bold mb-6 text-primary">Tailored Cover Letter</p>
                                            <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                                                {result.tailoredContent.coverLetter}
                                            </p>
                                            <div className="mt-12 pt-8 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-on-surface-variant/40">
                                                <span>Full dossier available in Builder after finalization</span>
                                                <ArrowRight className="size-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}

function IntelItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="size-10 rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-primary/40 group-hover:text-accent group-hover:scale-110 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/30 leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{value || "Confidential"}</p>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="size-8 rounded-lg bg-accent/5 flex items-center justify-center text-accent shrink-0">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface">{title}</p>
                <p className="text-[11px] leading-relaxed text-on-surface-variant/60 font-medium">{desc}</p>
            </div>
        </div>
    );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
            active 
                ? "bg-surface text-primary shadow-xl shadow-primary/5 ring-1 ring-primary/5" 
                : "text-on-surface-variant/50 hover:text-on-surface hover:bg-surface/50"
        }`}>
            {icon} {label}
        </button>
    );
}

