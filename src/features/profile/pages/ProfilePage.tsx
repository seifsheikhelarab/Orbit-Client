import { useState, useEffect, useRef } from "react";
import { useProfile, useUpdateProfile, useParseCv } from "../api/useProfile";
import { defaultResumeData, ResumeData } from "../../cv-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Loader2, Save, User, Briefcase, GraduationCap, 
    Lightbulb, Plus, Trash2, Heart, Globe, Sparkles,
    ChevronRight, ChevronDown, ChevronUp, Layers,
    Upload, FileText, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const parseCv = useParseCv();
    const [formData, setFormData] = useState<ResumeData>(defaultResumeData);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [showCvDialog, setShowCvDialog] = useState(false);
    const [parsedCvData, setParsedCvData] = useState<ResumeData | null>(null);
    const [cvFileName, setCvFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile?.content) {
            setFormData(profile.content);
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(formData);
            toast.success("Professional profile synchronized");
        } catch (error) {
            toast.error("Failed to update dossier");
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!ext || !["pdf", "docx", "doc"].includes(ext)) {
            toast.error("Please upload a PDF or DOCX file");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        try {
            setCvFileName(file.name);
            const parsed = await parseCv.mutateAsync(file);
            setParsedCvData(parsed);
            setShowCvDialog(true);
        } catch (error) {
            toast.error("Failed to parse CV. Please check the file and try again.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleApplyParsedCv = () => {
        if (!parsedCvData) return;
        setFormData(parsedCvData);
        setShowCvDialog(false);
        setParsedCvData(null);
        toast.success(`Profile populated from ${cvFileName}`);
    };

    const toggleCollapse = (key: string) => {
        setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const moveItem = (array: any[], from: number, to: number) => {
        const result = [...array];
        const [item] = result.splice(from, 1);
        result.splice(to, 0, item);
        return result;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 w-full animate-in fade-in duration-500">
                <Loader2 className="size-10 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <PageContainer maxWidth="xl" className="pb-24 relative overflow-hidden">
            {/* Background Telemetry Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none select-none">
                <div className="absolute inset-0 animate-telemetry-pulse" style={{ backgroundImage: 'radial-gradient(circle, var(--color-dossier) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
            </div>

            <PageHeader
                icon={User}
                title="Professional Dossier"
                description="Your central record of experience and skills used for AI tailoring."
                className="mb-12"
                actions={
                    <div className="flex items-center gap-3">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.doc"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <Button
                            variant="outline"
                            disabled={parseCv.isPending}
                            onClick={() => fileInputRef.current?.click()}
                            className="shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                        >
                            {parseCv.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Parsing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import CV
                                </>
                            )}
                        </Button>

                        <Button 
                            onClick={handleSave}
                            disabled={updateProfile.isPending}
                            variant="dossier"
                            className="shadow-2xl shadow-dossier/20 hover:shadow-dossier/30 transition-all duration-300 active:scale-95"
                        >
                            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Sync Dossier
                        </Button>
                    </div>
                }
            />

            {/* CV Parsing Confirmation Dialog */}
            <Dialog open={showCvDialog} onOpenChange={setShowCvDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-dossier/10 flex items-center justify-center text-dossier">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <span>Import CV Data</span>
                                <p className="text-sm font-normal text-on-surface-variant mt-0.5">
                                    {cvFileName}
                                </p>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/10">
                                <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
                                <div className="text-sm text-on-surface-variant leading-relaxed">
                                    This will replace your current professional dossier entries with the data extracted from your CV.
                                    Existing data will be overwritten. You can review and edit everything before saving.
                                </div>
                            </div>

                            {parsedCvData && (
                                <div className="mt-6 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                                        Extracted Summary
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {parsedCvData.basics.name && (
                                            <SummaryItem label="Name" value={parsedCvData.basics.name} />
                                        )}
                                        {parsedCvData.basics.email && (
                                            <SummaryItem label="Email" value={parsedCvData.basics.email} />
                                        )}
                                        <SummaryItem label="Experience" value={`${parsedCvData.work.length} entries`} />
                                        <SummaryItem label="Education" value={`${parsedCvData.education.length} entries`} />
                                        <SummaryItem label="Skills" value={`${parsedCvData.skills.length} entries`} />
                                        {parsedCvData.projects.length > 0 && (
                                            <SummaryItem label="Projects" value={`${parsedCvData.projects.length} entries`} />
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => { setShowCvDialog(false); setParsedCvData(null); }}>
                            Cancel
                        </Button>
                        <Button variant="dossier" onClick={handleApplyParsedCv}>
                            <FileText className="w-4 h-4 mr-2" />
                            Apply to Dossier
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start stagger-children">
                <div className="lg:col-span-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Basics Section */}
                    <Section title="Identity & Summary" icon={<User className="w-5 h-5" />} index={0}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface-container-low/30 p-8 rounded-2xl border border-outline-variant/10">
                            <Field label="Full Name">
                                <Input 
                                    value={formData.basics.name} 
                                    onChange={e => setFormData({...formData, basics: {...formData.basics, name: e.target.value}})}
                                    className="bg-surface border-dossier/30 focus-visible:ring-dossier/10 rounded-xl"
                                />
                            </Field>
                            <Field label="Professional Label">
                                <Input 
                                    placeholder="e.g. Principal Product Designer" 
                                    value={formData.basics.label} 
                                    onChange={e => setFormData({...formData, basics: {...formData.basics, label: e.target.value}})}
                                    className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-xl"
                                />
                            </Field>
                            <Field label="Contact Email">
                                <Input 
                                    value={formData.basics.email} 
                                    onChange={e => setFormData({...formData, basics: {...formData.basics, email: e.target.value}})}
                                    className="bg-surface border-dossier/30 focus-visible:ring-dossier/10 rounded-xl"
                                />
                            </Field>
                            <Field label="Contact Phone">
                                <Input 
                                    value={formData.basics.phone} 
                                    onChange={e => setFormData({...formData, basics: {...formData.basics, phone: e.target.value}})}
                                    className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-xl"
                                />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Base Location">
                                    <Input 
                                        value={formData.basics.location} 
                                        onChange={e => setFormData({...formData, basics: {...formData.basics, location: e.target.value}})}
                                        className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-xl"
                                    />
                                </Field>
                            </div>
                            <div className="sm:col-span-2">
                                <Field label="Strategic Summary" help="High-level overview of your professional value proposition.">
                                    <Textarea 
                                        rows={5} 
                                        value={formData.basics.summary} 
                                        onChange={e => setFormData({...formData, basics: {...formData.basics, summary: e.target.value}})}
                                        className="bg-surface border-dossier/30 focus-visible:ring-dossier/10 rounded-2xl resize-none leading-relaxed"
                                    />
                                </Field>
                            </div>
                        </div>
                    </Section>

                    {/* Experience Section */}
                    <Section title="Professional Trajectory" icon={<Briefcase className="w-5 h-5" />} index={1}>
                        <div className="space-y-6">
                            {formData.work.map((exp, i) => {
                                const isCollapsed = collapsed[`work-${i}`];
                                return (
                                <div key={i} className={`rounded-2xl bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all ${isCollapsed ? 'p-4' : 'p-8'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <button 
                                            onClick={() => toggleCollapse(`work-${i}`)}
                                            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant/40 hover:text-primary"
                                            title={isCollapsed ? "Expand" : "Minimize"}
                                        >
                                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                        </button>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                disabled={i === 0}
                                                onClick={() => setFormData({...formData, work: moveItem(formData.work, i, i - 1)})}
                                                className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                disabled={i === formData.work.length - 1}
                                                onClick={() => setFormData({...formData, work: moveItem(formData.work, i, i + 1)})}
                                                className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isCollapsed ? (
                                                <button onClick={() => toggleCollapse(`work-${i}`)} className="text-left w-full">
                                                    <p className="text-sm font-bold text-on-surface truncate">{exp.position || "Add role"}</p>
                                                    <p className="text-xs text-on-surface-variant truncate">{exp.company || "Add organization"}</p>
                                                </button>
                                            ) : null}
                                        </div>
                                        <button 
                                            onClick={() => setFormData({...formData, work: formData.work.filter((_, idx) => idx !== i)})}
                                            className="ml-auto opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Organization"><Input value={exp.company} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], company: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Role Title"><Input value={exp.position} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], position: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Interval Start"><Input value={exp.startDate} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], startDate: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Interval End"><Input value={exp.endDate} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], endDate: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Impact & Key Results" help="List your primary achievements. AI will use these to match job requirements."><Textarea rows={4} value={exp.highlights} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], highlights: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-2xl resize-none" /></Field>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            )})}
                            <Button 
                                variant="outline"                                    className="w-full border-dashed border-outline-variant/40 py-10 rounded-2xl text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, work: [...formData.work, {company: "", position: "", startDate: "", endDate: "", highlights: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Add Experience
                            </Button>
                        </div>
                    </Section>

                    {/* Education Section */}
                    <Section title="Academic Foundation" icon={<GraduationCap className="w-5 h-5" />} index={2}>
                        <div className="space-y-6">
                            {formData.education.map((edu, i) => {
                                const isCollapsed = collapsed[`education-${i}`];
                                return (
                                <div key={i} className={`rounded-2xl bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all ${isCollapsed ? 'p-4' : 'p-8'}`}>
                                     <div className="flex items-center gap-2 mb-4">
                                         <button 
                                             onClick={() => toggleCollapse(`education-${i}`)}
                                            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant/40 hover:text-primary"
                                        >
                                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                        </button>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button disabled={i === 0} onClick={() => setFormData({...formData, education: moveItem(formData.education, i, i - 1)})} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                                            <button disabled={i === formData.education.length - 1} onClick={() => setFormData({...formData, education: moveItem(formData.education, i, i + 1)})} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isCollapsed ? (
                                                <button onClick={() => toggleCollapse(`education-${i}`)} className="text-left w-full">
                                                    <p className="text-sm font-bold text-on-surface truncate">{edu.area || "Add field of study"}</p>
                                                    <p className="text-xs text-on-surface-variant truncate">{edu.institution || "Add institution"}</p>
                                                </button>
                                            ) : null}
                                        </div>
                                        <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="ml-auto opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Institution"><Input value={edu.institution} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], institution: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Study Type"><Input value={edu.studyType} placeholder="e.g. Bachelor's" onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], studyType: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Area of Study"><Input value={edu.area} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], area: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Completion Date"><Input value={edu.endDate} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], endDate: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                    </div>
                                    )}
                                </div>
                            )})}
                            <Button 
                                variant="outline"                                    className="w-full border-dashed border-outline-variant/40 py-10 rounded-2xl text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, education: [...formData.education, {institution: "", studyType: "", area: "", startDate: "", endDate: "", score: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Add Education
                            </Button>
                        </div>
                    </Section>

                    {/* Projects Section */}
                    <Section title="Key Initiatives & Projects" icon={<Layers className="w-5 h-5" />} index={3}>
                        <div className="space-y-6">
                            {formData.projects.map((proj, i) => {
                                const isCollapsed = collapsed[`projects-${i}`];
                                return (
                                <div key={i} className={`rounded-2xl bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all ${isCollapsed ? 'p-4' : 'p-8'}`}>
                                     <div className="flex items-center gap-2 mb-4">
                                         <button 
                                             onClick={() => toggleCollapse(`projects-${i}`)}
                                            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant/40 hover:text-primary"
                                        >
                                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                        </button>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button disabled={i === 0} onClick={() => setFormData({...formData, projects: moveItem(formData.projects, i, i - 1)})} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                                            <button disabled={i === formData.projects.length - 1} onClick={() => setFormData({...formData, projects: moveItem(formData.projects, i, i + 1)})} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant/40 hover:text-primary disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isCollapsed ? (
                                                <button onClick={() => toggleCollapse(`projects-${i}`)} className="text-left w-full">
                                                    <p className="text-sm font-bold text-on-surface truncate">{proj.name || "Add project title"}</p>
                                                </button>
                                            ) : null}
                                        </div>
                                        <button onClick={() => setFormData({...formData, projects: formData.projects.filter((_, idx) => idx !== i)})} className="ml-auto opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Project Title"><Input value={proj.name} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], name: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Source/Live URL"><Input value={proj.url} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], url: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Narrative Description" help="Explain the problem solved and your technical contribution."><Textarea rows={4} value={proj.highlights} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], highlights: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-2xl resize-none" /></Field>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            )})}
                            <Button 
                                variant="outline"                                    className="w-full border-dashed border-outline-variant/40 py-10 rounded-2xl text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, projects: [...formData.projects, {name: "", description: "", highlights: "", url: "", startDate: "", endDate: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Add Project
                            </Button>
                        </div>
                    </Section>

                    {/* Skills Section */}
                    <Section title="Expertise & Skills" icon={<Lightbulb className="w-5 h-5" />} index={4}>
                        <div className="p-8 rounded-2xl bg-surface-container-low/30 border border-outline-variant/10 space-y-8">
                                 <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 pl-4 pr-2 py-2 bg-surface border border-outline-variant/30 rounded-full text-xs font-bold text-on-surface hover:shadow-md hover:border-primary/20 transition-all animate-in zoom-in-95 duration-300">
                                        <span>{skill.name}</span>
                                        <button 
                                            onClick={() => setFormData({...formData, skills: formData.skills.filter((_, idx) => idx !== i)})}
                                            className="size-5 rounded-full flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                {formData.skills.length === 0 && (
                                    <p className="text-xs text-on-surface-variant/40 italic py-2">No expertise records found. Add them below.</p>
                                )}
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <Input 
                                    placeholder="Add a competence (e.g. Distributed Systems, Product Strategy) and press Enter..." 
                                    className="bg-surface border-outline-variant/30 rounded-xl flex-1 py-6 shadow-inner"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const s = e.currentTarget.value.trim();
                                            if (s) {
                                                setFormData({...formData, skills: [...formData.skills, { name: s, level: "", keywords: "" }]});
                                                e.currentTarget.value = "";
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Secondary Sections */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: '600ms' }}>
                        {/* Volunteering */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Heart className="size-5 text-error/60" />
                                <h3 className="text-label-sm font-black text-on-surface uppercase tracking-widest">Volunteering</h3>
                            </div>
                            <div className="space-y-4">
                                {formData.volunteer.map((vol, i) => (
                                    <div key={i} className="rounded-2xl bg-surface-container-low/20 border border-outline-variant/5 group relative transition-all overflow-hidden">
                                        <button 
                                            onClick={() => {
                                                const isOpen = document.getElementById(`volunteer-${i}`);
                                                isOpen?.classList.toggle('hidden');
                                                isOpen?.querySelector('input')?.focus();
                                            }}
                                            className="w-full p-6 text-left"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">{vol.organization || "Untitled organization"}</p>
                                                    <p className="text-label-sm text-on-surface-variant font-medium mt-0.5">{vol.position || "Add role"}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary transition-all" />
                                            </div>
                                        </button>
                                        <div id={`volunteer-${i}`} className="hidden px-6 pb-6 pt-0 border-t border-outline-variant/10">
                                            <div className="pt-4 space-y-3">
                                                <Field label="Organization"><Input value={vol.organization} onChange={e => { const v = [...formData.volunteer]; v[i] = {...v[i], organization: e.target.value}; setFormData({...formData, volunteer: v}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                <Field label="Role"><Input value={vol.position} onChange={e => { const v = [...formData.volunteer]; v[i] = {...v[i], position: e.target.value}; setFormData({...formData, volunteer: v}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Field label="Start"><Input value={vol.startDate} onChange={e => { const v = [...formData.volunteer]; v[i] = {...v[i], startDate: e.target.value}; setFormData({...formData, volunteer: v}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                    <Field label="End"><Input value={vol.endDate} onChange={e => { const v = [...formData.volunteer]; v[i] = {...v[i], endDate: e.target.value}; setFormData({...formData, volunteer: v}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                </div>
                                                <Field label="Impact"><Textarea rows={2} value={vol.highlights} onChange={e => { const v = [...formData.volunteer]; v[i] = {...v[i], highlights: e.target.value}; setFormData({...formData, volunteer: v}) }} className="bg-surface border-outline-variant/30 rounded-xl resize-none" /></Field>
                                                <button 
                                                    onClick={e => { e.stopPropagation(); setFormData({...formData, volunteer: formData.volunteer.filter((_, idx) => idx !== i)}) }}
                                                    className="w-full text-center text-xs font-bold text-error hover:text-error-hover transition-colors py-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => setFormData({...formData, volunteer: [...formData.volunteer, {organization: "", position: "", highlights: "", startDate: "", endDate: ""}]})}>
                                    <Plus className="size-3 mr-2" /> Add
                                </Button>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Globe className="size-5 text-accent/60" />
                                <h3 className="text-label-sm font-black text-on-surface uppercase tracking-widest">Languages</h3>
                            </div>
                            <div className="space-y-4">
                                {formData.languages.map((lang, i) => (
                                    <div key={i} className="rounded-2xl bg-surface-container-low/20 border border-outline-variant/5 group relative transition-all overflow-hidden">
                                        <button 
                                            onClick={() => {
                                                const isOpen = document.getElementById(`language-${i}`);
                                                isOpen?.classList.toggle('hidden');
                                                isOpen?.querySelector('input')?.focus();
                                            }}
                                            className="w-full p-6 text-left"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">{lang.name || "Untitled language"}</p>
                                                    <p className="text-label-sm text-on-surface-variant font-medium mt-0.5">{lang.fluency || "Add fluency"}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary transition-all" />
                                            </div>
                                        </button>
                                        <div id={`language-${i}`} className="hidden px-6 pb-6 pt-0 border-t border-outline-variant/10">
                                            <div className="pt-4 space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Field label="Language"><Input value={lang.name} onChange={e => { const l = [...formData.languages]; l[i] = {...l[i], name: e.target.value}; setFormData({...formData, languages: l}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                    <Field label="Fluency"><Input value={lang.fluency} onChange={e => { const l = [...formData.languages]; l[i] = {...l[i], fluency: e.target.value}; setFormData({...formData, languages: l}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                                </div>
                                                <Field label="Details"><Textarea rows={2} value={lang.highlights} onChange={e => { const l = [...formData.languages]; l[i] = {...l[i], highlights: e.target.value}; setFormData({...formData, languages: l}) }} className="bg-surface border-outline-variant/30 rounded-xl resize-none" placeholder="Certifications, test scores..." /></Field>
                                                <button 
                                                    onClick={e => { e.stopPropagation(); setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)}) }}
                                                    className="w-full text-center text-xs font-bold text-error hover:text-error-hover transition-colors py-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => setFormData({...formData, languages: [...formData.languages, {name: "", fluency: "", highlights: "", startDate: ""}]})}>
                                    <Plus className="size-3 mr-2" /> Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
                    <div className="sticky top-24 space-y-8">
                        {/* Navigation */}
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10 text-left hover:bg-surface-container transition-all" onClick={() => navigate("/app/autocv")}>
                            <div className="size-8 rounded-lg bg-dossier/10 flex items-center justify-center text-dossier shrink-0">
                                <Sparkles className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface">AutoCV Engine</p>
                                <p className="text-xs text-on-surface-variant">Tailor dossiers</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">{label}</span>
            <span className="text-xs font-bold text-on-surface truncate max-w-[140px] ml-2">{value}</span>
        </div>
    );
}

function Section({ title, icon, children, index }: { title: string; icon: React.ReactNode; children: React.ReactNode; index: number }) {
    return (
        <section className="space-y-6 animate-in fade-in duration-700" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary shrink-0">
                    {icon}
                </div>
                <h2 className="text-title-lg font-bold text-on-surface">{title}</h2>
            </div>
            {children}
        </section>
    );
}    function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</Label>
            {help && <p className="text-label-md text-on-surface-variant/50 leading-tight">{help}</p>}
            {children}
        </div>
    );
}

