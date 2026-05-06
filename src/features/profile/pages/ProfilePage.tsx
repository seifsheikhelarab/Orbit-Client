import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "../api/useProfile";
import { defaultResumeData, ResumeData } from "../../cv-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Loader2, Save, User, Briefcase, GraduationCap, 
    Lightbulb, Plus, Trash2, Heart, Globe, Award, Sparkles,
    ChevronRight, Layers
} from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/ui";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const [formData, setFormData] = useState<ResumeData>(defaultResumeData);
    const navigate = useNavigate();

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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in duration-500">
                <Loader2 className="size-10 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <PageContainer maxWidth="xl" className="pb-24 relative overflow-hidden">
            {/* Background Telemetry Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02] pointer-events-none select-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <PageHeader
                icon={User}
                title="Professional Dossier"
                description="Your central record of experience and skills used for AI tailoring."
                className="mb-12"
                actions={
                    <Button 
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                        className="shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 active:scale-95"
                    >
                        {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Sync Dossier
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start stagger-children">
                <div className="lg:col-span-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Basics Section */}
                    <Section title="Identity & Summary" icon={<User className="w-5 h-5" />} index={0}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/10">
                            <Field label="Full Name">
                                <Input 
                                    value={formData.basics.name} 
                                    onChange={e => setFormData({...formData, basics: {...formData.basics, name: e.target.value}})}
                                    className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-xl"
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
                                    className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-xl"
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
                                        className="bg-surface border-outline-variant/30 focus-visible:ring-primary/10 rounded-2xl resize-none leading-relaxed"
                                    />
                                </Field>
                            </div>
                        </div>
                    </Section>

                    {/* Experience Section */}
                    <Section title="Professional Trajectory" icon={<Briefcase className="w-5 h-5" />} index={1}>
                        <div className="space-y-6">
                            {formData.work.map((exp, i) => (
                                <div key={i} className="p-8 rounded-[32px] bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all hover:bg-surface-container-low/40 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <button 
                                        onClick={() => setFormData({...formData, work: formData.work.filter((_, idx) => idx !== i)})}
                                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Organization"><Input value={exp.company} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], company: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Role Title"><Input value={exp.position} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], position: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Interval Start"><Input value={exp.startDate} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], startDate: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Interval End"><Input value={exp.endDate} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], endDate: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Impact & Key Results" help="List your primary achievements. AI will use these to match job requirements."><Textarea rows={4} value={exp.highlights} onChange={e => { const w = [...formData.work]; w[i] = {...w[i], highlights: e.target.value}; setFormData({...formData, work: w}) }} className="bg-surface border-outline-variant/30 rounded-2xl resize-none" /></Field>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed border-outline-variant/40 py-10 rounded-[32px] text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, work: [...formData.work, {company: "", position: "", startDate: "", endDate: "", highlights: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Append Professional Record
                            </Button>
                        </div>
                    </Section>

                    {/* Education Section */}
                    <Section title="Academic Foundation" icon={<GraduationCap className="w-5 h-5" />} index={2}>
                        <div className="space-y-6">
                            {formData.education.map((edu, i) => (
                                <div key={i} className="p-8 rounded-[32px] bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all hover:bg-surface-container-low/40 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <button 
                                        onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})}
                                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Institution"><Input value={edu.institution} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], institution: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Study Type"><Input value={edu.studyType} placeholder="e.g. Bachelor's" onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], studyType: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Area of Study"><Input value={edu.area} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], area: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Completion Date"><Input value={edu.endDate} onChange={e => { const ed = [...formData.education]; ed[i] = {...ed[i], endDate: e.target.value}; setFormData({...formData, education: ed}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                    </div>
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed border-outline-variant/40 py-10 rounded-[32px] text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, education: [...formData.education, {institution: "", studyType: "", area: "", startDate: "", endDate: "", score: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Append Academic Record
                            </Button>
                        </div>
                    </Section>

                    {/* Projects Section */}
                    <Section title="Key Initiatives & Projects" icon={<Layers className="w-5 h-5" />} index={3}>
                        <div className="space-y-6">
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="p-8 rounded-[32px] bg-surface-container-low/20 border border-outline-variant/5 relative group transition-all hover:bg-surface-container-low/40 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <button 
                                        onClick={() => setFormData({...formData, projects: formData.projects.filter((_, idx) => idx !== i)})}
                                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Field label="Project Title"><Input value={proj.name} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], name: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <Field label="Source/Live URL"><Input value={proj.url} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], url: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-xl" /></Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Narrative Description" help="Explain the problem solved and your technical contribution."><Textarea rows={4} value={proj.highlights} onChange={e => { const p = [...formData.projects]; p[i] = {...p[i], highlights: e.target.value}; setFormData({...formData, projects: p}) }} className="bg-surface border-outline-variant/30 rounded-2xl resize-none" /></Field>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed border-outline-variant/40 py-10 rounded-[32px] text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group" 
                                onClick={() => setFormData({...formData, projects: [...formData.projects, {name: "", description: "", highlights: "", url: "", startDate: "", endDate: ""}]})}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                Append Project Initiative
                            </Button>
                        </div>
                    </Section>

                    {/* Skills Section */}
                    <Section title="Expertise & Skills" icon={<Lightbulb className="w-5 h-5" />} index={4}>
                        <div className="p-8 rounded-[32px] bg-surface-container-low/30 border border-outline-variant/10 space-y-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                                <Award className="size-32" />
                            </div>
                            <div className="flex flex-wrap gap-2.5 relative z-10">
                                {formData.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 pl-4 pr-2 py-2 bg-surface border border-outline-variant/30 rounded-full text-xs font-bold text-on-surface shadow-sm hover:shadow-md hover:border-primary/20 transition-all animate-in zoom-in-95 duration-300">
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
                                    <div key={i} className="rounded-3xl bg-surface-container-low/20 border border-outline-variant/5 group relative transition-all overflow-hidden">
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
                                                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{vol.position || "Add role"}</p>
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
                                                    Remove Record
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full border-dashed rounded-2xl" onClick={() => setFormData({...formData, volunteer: [...formData.volunteer, {organization: "", position: "", highlights: "", startDate: "", endDate: ""}]})}>
                                    <Plus className="size-3 mr-2" /> Add Record
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
                                    <div key={i} className="rounded-3xl bg-surface-container-low/20 border border-outline-variant/5 group relative transition-all overflow-hidden">
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
                                                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{lang.fluency || "Add fluency"}</p>
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
                                                    Remove Record
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full border-dashed rounded-2xl" onClick={() => setFormData({...formData, languages: [...formData.languages, {name: "", fluency: "", highlights: "", startDate: ""}]})}>
                                    <Plus className="size-3 mr-2" /> Add Record
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
                    <div className="sticky top-24 space-y-8">
                        {/* AI Readiness Card */}
                        <div className="p-8 rounded-[40px] bg-linear-to-br from-primary via-primary-hover to-primary text-on-primary shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 size-48 bg-accent/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="size-5 text-accent animate-icon-float" />
                                    <h3 className="font-bold text-lg tracking-tight">Intelligence Readiness</h3>
                                </div>
                                <p className="text-on-primary/70 text-xs leading-relaxed font-medium">
                                    Our models use this dossier as the ground truth. The higher the completeness, the better the tailoring accuracy.
                                </p>
                                
                                <div className="space-y-4 pt-2">
                                    <ScoreItem label="Identity Record" score={formData.basics.name && formData.basics.summary ? 100 : 40} />
                                    <ScoreItem label="Experience Volume" score={Math.min(formData.work.length * 25, 100)} />
                                    <ScoreItem label="Skill Density" score={Math.min(formData.skills.length * 10, 100)} />
                                </div>

                                <div className="pt-4 border-t border-on-primary/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-on-primary/40">
                                    <span>Sync Status</span>
                                    <span className="text-accent flex items-center gap-1.5">
                                        <div className="size-1 bg-accent rounded-full animate-pulse" />
                                        Connected
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Navigation Shortcut */}
                        <div className="p-8 rounded-[32px] bg-surface-container-low border border-outline-variant/10 group cursor-pointer hover:border-primary/20 transition-all" onClick={() => navigate("/app/autocv")}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Sparkles className="size-5" />
                                </div>
                                <ChevronRight className="size-4 text-on-surface-variant/40 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h4 className="font-bold text-on-surface">AutoCV Engine</h4>
                            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">Generate tailored dossiers</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

function Section({ title, icon, children, index }: { title: string; icon: React.ReactNode; children: React.ReactNode; index: number }) {
    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-primary shadow-sm">
                    {icon}
                </div>
                <div>
                    <h2 className="text-display-sm text-on-surface">{title}</h2>
                    <div className="h-0.5 w-12 bg-accent mt-2 rounded-full" />
                </div>
            </div>
            {children}
        </section>
    );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2.5">
            <div className="flex flex-col gap-0.5 px-1">
                <Label className="text-label-sm text-on-surface-variant font-bold">{label}</Label>
                {help && <p className="text-[10px] text-on-surface-variant/40 font-medium leading-tight">{help}</p>}
            </div>
            {children}
        </div>
    );
}

function ScoreItem({ label, score }: { label: string; score: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-primary/60">
                <span>{label}</span>
                <span className="text-accent">{score}%</span>
            </div>
            <div className="h-1 bg-on-primary/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out-expo" 
                    style={{ width: `${score}%` }} 
                />
            </div>
        </div>
    );
}
