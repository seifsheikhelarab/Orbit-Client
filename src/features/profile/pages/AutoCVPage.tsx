import { useState } from "react";
import { useAutoCV, useSaveAutoCV } from "../api/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    Loader2, Sparkles, Wand2, FileText, CheckCircle2, 
    Briefcase, MapPin, DollarSign,
    Zap, GraduationCap, Lightbulb, Heart, Globe, Award
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { Label } from "@/components/ui/label";

export default function AutoCVPage() {
    const [jobDescription, setJobDescription] = useState("");
    const generate = useAutoCV();
    const save = useSaveAutoCV();
    const navigate = useNavigate();

    const [result, setResult] = useState<any>(null);
    const [activeDoc, setActiveDoc] = useState<string>("resume");

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
        if (!result) return;
        try {
            const saved = await save.mutateAsync({
                jobData: result.jobData,
                tailoredContent: result.tailoredContent
            });
            toast.success("Dossier finalized and application created!");
            navigate(`/app/applications/${saved.application.id}`);
        } catch (error) {
            toast.error("Failed to finalize application");
        }
    };

    return (
        <PageContainer maxWidth="xl" className="pb-24 relative overflow-hidden">
            {/* Background Telemetry Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-dossier) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
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
                        <div className="lg:col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                                <div className="flex flex-col gap-1 mb-6">
                                    <Label className="text-label-sm font-bold text-primary uppercase tracking-wider">Target Intel</Label>
                                    <span className="text-label-sm text-on-surface-variant/50 font-bold uppercase tracking-widest">Paste the job description</span>
                                </div>

                                <Textarea 
                                    placeholder="Paste the full job description or requirements dossier here..."
                                    className="min-h-[400px] bg-surface/50 border-none rounded-2xl p-8 text-body-md leading-relaxed focus-visible:ring-2 ring-primary/5 resize-none transition-all"
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                />
                                
                                <div className="mt-10">
                                    <Button 
                                        variant="dossier"
                                        className="w-full py-10 rounded-xl font-bold text-lg group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden"
                                        onClick={handleGenerate}
                                        disabled={generate.isPending}
                                    >
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


                </div>
            </div>
        ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="p-8" variant="elevated">
                            <div className="space-y-2">
                                <span className="text-label-sm font-bold uppercase tracking-wider text-primary/60">Extracted Intel</span>
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
                                    size="lg"
                                    className="w-full rounded-xl font-bold"
                                    onClick={handleSave}
                                    disabled={save.isPending}
                                >
                                    {save.isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-3" />}
                                    Finalize & Apply
                                </Button>
                                
                                <Button variant="ghost" size="sm" className="w-full" onClick={() => setResult(null)}>
                                    Discard Synthesis
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <div className="p-8 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 space-y-10 min-h-[600px]">
                            <Tabs value={activeDoc} onValueChange={setActiveDoc}>
                                <div className="flex items-center justify-between">
                                    <TabsList variant="default" className="rounded-2xl border border-outline-variant/10">
                                        <TabsTrigger value="resume" className="data-[state=active]:bg-surface data-[state=active]:text-dossier data-[state=active]:shadow-sm data-[state=active]:after:bg-dossier gap-2 px-5 py-3">
                                            <FileText className="size-4" />
                                            Synthesized Resume
                                        </TabsTrigger>
                                        <TabsTrigger value="coverLetter" className="data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-sm data-[state=active]:after:bg-accent gap-2 px-5 py-3">
                                            <FileText className="size-4" />
                                            Tailored Cover Letter
                                        </TabsTrigger>
                                    </TabsList>
                                    <div className="hidden sm:flex items-center gap-2 text-label-sm font-bold text-dossier uppercase tracking-widest">
                                        <Zap className="size-3" />
                                        Optimized for ATS
                                    </div>
                                </div>
                                
                                <div className="space-y-10 animate-in fade-in duration-1000 mt-10">
                                    <TabsContent value="resume" className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                                <Wand2 className="size-4" />
                                            </div>
                                            <h4 className="text-label-sm font-bold uppercase tracking-wider text-on-surface">Synthesis Insight</h4>
                                        </div>
                                        <p className="text-body-md text-on-surface-variant leading-relaxed italic">
                                            "The professional summary has been re-engineered to emphasize your expertise in <strong>{result.jobData.jobTitle}</strong>, directly aligning with <strong>{result.jobData.company}'s</strong> stated requirements for this role."
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="coverLetter" className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                                <Wand2 className="size-4" />
                                            </div>
                                            <h4 className="text-label-sm font-bold uppercase tracking-wider text-on-surface">Synthesis Insight</h4>
                                        </div>
                                        <p className="text-body-md text-on-surface-variant leading-relaxed italic">
                                            "The cover letter has been crafted to demonstrate genuine enthusiasm for <strong>{result.jobData.company}</strong> while highlighting your most relevant qualifications for the <strong>{result.jobData.jobTitle}</strong> position."
                                        </p>
                                    </TabsContent>

                                            <TabsContent value="resume">
                                        <div className="p-8 rounded-2xl bg-surface border border-outline-variant/30 font-body leading-relaxed text-on-surface space-y-8">
                                            {result.tailoredContent.resumeContent.basics.summary && (
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-dossier mb-4">Professional Summary</p>
                                                    <p className="text-on-surface-variant leading-relaxed">
                                                        {result.tailoredContent.resumeContent.basics.summary}
                                                    </p>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.work?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Briefcase className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Experience</p>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {result.tailoredContent.resumeContent.work.map((exp: any, i: number) => (
                                                            <div key={i} className="border-l-2 border-dossier/20 pl-4">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <p className="font-bold text-sm text-on-surface">{exp.position}</p>
                                                                    <span className="text-label-sm text-on-surface-variant/50 shrink-0">
                                                                        {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                                                                    </span>
                                                                </div>
                                                                {exp.company && <p className="text-label-sm text-on-surface-variant/70 mt-0.5">{exp.company}</p>}
                                                                {exp.highlights && (
                                                                    <p className="text-xs text-on-surface-variant/50 mt-2 leading-relaxed">
                                                                        {exp.highlights.split('\n').map((h: string, j: number) => (
                                                                            <span key={j} className="block before:content-['•'] before:mr-1.5 before:text-dossier/40">{h}</span>
                                                                        ))}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.skills?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Lightbulb className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Skills</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.tailoredContent.resumeContent.skills.map((skill: any, i: number) => (
                                                            <span key={i} className="px-3 py-1.5 rounded-full bg-dossier/5 border border-dossier/10 text-xs font-bold text-dossier">
                                                                {skill.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.education?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <GraduationCap className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Education</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {result.tailoredContent.resumeContent.education.map((edu: any, i: number) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-sm font-bold text-on-surface">{edu.institution}</p>
                                                                    {edu.studyType && <p className="text-xs text-on-surface-variant/60">{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}</p>}
                                                                </div>
                                                                {edu.endDate && <span className="text-label-sm text-on-surface-variant/50">{edu.endDate}</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.projects?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Award className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Projects</p>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {result.tailoredContent.resumeContent.projects.map((proj: any, i: number) => (
                                                            <div key={i} className="border-l-2 border-dossier/20 pl-4">
                                                                <p className="font-bold text-sm text-on-surface">{proj.name}</p>
                                                                {proj.description && <p className="text-xs text-on-surface-variant/60 mt-1">{proj.description}</p>}
                                                                {proj.highlights && (
                                                                    <p className="text-xs text-on-surface-variant/50 mt-2 leading-relaxed">
                                                                        {proj.highlights.split('\n').map((h: string, j: number) => (
                                                                            <span key={j} className="block before:content-['•'] before:mr-1.5 before:text-dossier/40">{h}</span>
                                                                        ))}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.volunteer?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Heart className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Volunteer</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {result.tailoredContent.resumeContent.volunteer.map((vol: any, i: number) => (
                                                            <div key={i} className="border-l-2 border-dossier/20 pl-4">
                                                                <p className="text-sm font-bold text-on-surface">{vol.position}</p>
                                                                {vol.organization && <p className="text-xs text-on-surface-variant/60">{vol.organization}</p>}
                                                                {vol.highlights && <p className="text-xs text-on-surface-variant/50 mt-1">{vol.highlights}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.tailoredContent.resumeContent.languages?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Globe className="size-3.5 text-dossier/60" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-dossier">Languages</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {result.tailoredContent.resumeContent.languages.map((lang: any, i: number) => (
                                                            <span key={i} className="text-xs text-on-surface-variant/60">
                                                                {lang.name}{lang.fluency ? ` (${lang.fluency})` : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="coverLetter">
                                        <div className="p-8 rounded-2xl bg-surface border border-outline-variant/30 font-body leading-relaxed text-on-surface space-y-6">
                                            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Tailored Cover Letter</p>

                                            <p className="text-sm font-bold text-on-surface">
                                                {result.tailoredContent.coverLetter.senderName}
                                            </p>

                                            <div>
                                                <p className="text-sm text-on-surface">
                                                    Dear {result.tailoredContent.coverLetter.recipientName || 'Hiring Manager'},
                                                </p>
                                            </div>

                                            {result.tailoredContent.coverLetter.opening && (
                                                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                                                    {result.tailoredContent.coverLetter.opening}
                                                </p>
                                            )}

                                            {result.tailoredContent.coverLetter.body && (
                                                <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                                                    {result.tailoredContent.coverLetter.body}
                                                </p>
                                            )}

                                            {result.tailoredContent.coverLetter.closing && (
                                                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                                                    {result.tailoredContent.coverLetter.closing}
                                                </p>
                                            )}

                                            {result.tailoredContent.coverLetter.signature && (
                                                <div className="pt-4 border-t border-outline-variant/20">
                                                    <p className="text-sm font-medium text-on-surface">
                                                        {result.tailoredContent.coverLetter.signature}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
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
            <div className="size-10 rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-primary/40 group-hover:text-dossier group-hover:scale-110 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant/50 leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{value || "Confidential"}</p>
            </div>
        </div>
    );
}



