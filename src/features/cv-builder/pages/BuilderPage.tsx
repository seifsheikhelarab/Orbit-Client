import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResume, useUpdateResume } from "../api/useResumes";
import { ResumeData, defaultResumeData, CoverLetterContent, defaultCoverLetterContent, ResumeType, type ResumeSettings } from "../types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save, Download, Eye, User, Briefcase, GraduationCap, Lightbulb, Mail, ChevronDown, Plus, Trash2, Settings2, Award, Heart, Globe, Pencil } from "lucide-react";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { PreviewBuffer } from "../components/PreviewBuffer";

export function BuilderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: response, isLoading, isError } = useResume(id ?? "");
    
    const document = response?.data;

    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const [coverLetterData, setCoverLetterData] = useState<CoverLetterContent>(defaultCoverLetterContent);
    const [settings, setSettings] = useState<ResumeSettings>(defaultResumeData.settings);
    
    // Track the last saved state to avoid unnecessary saves
    const lastSavedRef = useRef<string>("");

    const updateResume = useUpdateResume();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");

    const docType = (document?.type as ResumeType) || "RESUME";

    useEffect(() => {
        if (document) {
            setNewName(document.name);
            
            const currentContent = document.content || {};
            const stateString = JSON.stringify({ name: document.name, content: currentContent, settings: document.settings || {} });
            lastSavedRef.current = stateString;

            if (docType === "RESUME") {
                const loadedSettings = {
                    ...defaultResumeData.settings,
                    ...(currentContent.settings || {}),
                    ...(document.settings || {})
                };
                const loadedResumeData = {
                    ...defaultResumeData,
                    ...currentContent,
                    settings: loadedSettings,
                    basics: {
                        ...defaultResumeData.basics,
                        ...(currentContent.basics || {})
                    }
                };
                setResumeData(loadedResumeData);
                setSettings(loadedSettings);
            } else {
                const loadedCoverLetterData = {
                    ...defaultCoverLetterContent,
                    ...currentContent
                };
                setCoverLetterData(loadedCoverLetterData);
                setSettings(defaultResumeData.settings);
            }
        }
    }, [document?.id]); // Only re-initialize when the ID changes

    const handleSave = async (skipToast = false) => {
        if (!id) return;
        
        const content = docType === "RESUME" ? { ...resumeData, settings } : coverLetterData;
        const currentSettings = docType === "RESUME" ? settings : {};
        const stateString = JSON.stringify({ name: newName, content, settings: currentSettings });
        
        // Final guard: if the stringified state matches what we last saved, don't trigger mutation
        if (stateString === lastSavedRef.current) return;
        
        try {
            await updateResume.mutateAsync({ id, name: newName, content, settings: currentSettings });
            lastSavedRef.current = stateString;
            if (!skipToast) toast.success("Saved successfully");
        } catch (error) {
            if (!skipToast) toast.error("Failed to save");
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [id, newName, resumeData, coverLetterData, settings]);

    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (formState.isDirty) { e.preventDefault(); e.returnValue = ""; }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [resumeData, coverLetterData]);

    const formState = { isDirty: false };

    const generatePdfBlob = useCallback(async () => {
        const { ResumePDF } = await import("../components/ResumePDF");
        const { CoverLetterTemplate } = await import("../components/templates/CoverLetterTemplate");
        
        if (docType === "COVER_LETTER") {
            return await pdf(<CoverLetterTemplate content={coverLetterData} />).toBlob();
        }
        return await pdf(<ResumePDF data={{ ...resumeData, settings }} />).toBlob();
    }, [docType, resumeData, coverLetterData, settings]);

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            const blob = await generatePdfBlob();
            const url = URL.createObjectURL(blob);
            const a = window.document.createElement("a");
            a.href = url;
            a.download = `${document?.name || (docType === "COVER_LETTER" ? "CoverLetter" : "Resume")}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Downloaded PDF successfully");
        } catch (error) {
            toast.error("Failed to generate PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (isError || !document) {
        return <div className="min-h-screen flex items-center justify-center pt-16 text-error">Failed to load document.</div>;
    }

    const resumeForm = (
        <main className="lg:col-span-4 overflow-y-auto p-6 space-y-6 bg-surface border-r border-outline">
            <CollapsibleSection title="Layout & Style" icon={<Settings2 className="w-4 h-4" />} defaultOpen={true}>
                <div className="space-y-5">
                    <SegmentedControl
                        label="Template style"
                        description="Modern is accent-led, Professional is classic, Minimal keeps density high."
                        value={settings.template}
                        options={["modern", "professional", "minimal"]}
                        onChange={(template) => setSettings((prev) => ({ ...prev, template: template as ResumeSettings["template"] }))}
                    />
                    <div className="space-y-4 bg-surface-container-low/50 p-6 rounded-2xl border border-outline/30">
                        <Label className="text-xs font-bold uppercase tracking-wider text-primary/60">Accent color</Label>
                        <p className="text-xs text-on-surface-variant/70 italic">Used for headers, dividers, links, and emphasis in the PDF.</p>
                        <div className="flex gap-4 items-center mt-2">
                            <div 
                                className="w-14 h-14 rounded-2xl border-4 border-surface ring-1 ring-outline/20 shrink-0 transition-transform hover:scale-105"
                                style={{ backgroundColor: settings.color || "#1e3a8a" }}
                            />
                            <div className="relative flex-1">
                                <input 
                                    type="color" 
                                    value={settings.color || "#1e3a8a"} 
                                    onChange={(e) => setSettings((prev) => ({ ...prev, color: e.target.value }))} 
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" 
                                />
                                <div className="h-12 w-full rounded-xl border border-outline bg-surface flex items-center px-4 text-xs font-mono text-on-surface-variant select-none">
                                    {settings.color?.toUpperCase() || "#1E3A8A"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <SegmentedControl
                        label="Text size"
                        description="Use small for dense resumes and large for short, senior profiles."
                        value={settings.fontSize}
                        options={["small", "medium", "large"]}
                        onChange={(fontSize) => setSettings((prev) => ({ ...prev, fontSize: fontSize as ResumeSettings["fontSize"] }))}
                    />
                    <SegmentedControl
                        label="Line spacing"
                        description="Controls vertical rhythm inside paragraphs and bullet lists."
                        value={settings.lineSpacing}
                        options={["compact", "normal", "relaxed"]}
                        onChange={(lineSpacing) => setSettings((prev) => ({ ...prev, lineSpacing: lineSpacing as ResumeSettings["lineSpacing"] }))}
                    />
                    <SegmentedControl
                        label="Page margins"
                        description="Narrow fits more content; wide creates a more editorial look."
                        value={settings.margin}
                        options={["narrow", "normal", "wide"]}
                        onChange={(margin) => setSettings((prev) => ({ ...prev, margin: margin as ResumeSettings["margin"] }))}
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Basics" icon={<User className="w-4 h-4" />} defaultOpen={true}>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Full Name" help="Your name as it should appear in the header.">
                            <Input placeholder="Full Name" value={resumeData.basics.name} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, name: e.target.value } })} />
                        </Field>
                        <Field label="Target Title" help="Match this to the role you are applying for.">
                            <Input placeholder="Job Title" value={resumeData.basics.label} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, label: e.target.value } })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Email" help="Use the same address you use on applications.">
                            <Input placeholder="Email" value={resumeData.basics.email} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, email: e.target.value } })} />
                        </Field>
                        <Field label="Phone" help="Optional, but recommended for recruiter follow-up.">
                            <Input placeholder="Phone" value={resumeData.basics.phone} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, phone: e.target.value } })} />
                        </Field>
                    </div>
                    <Field label="Location" help="City, region, or remote availability.">
                        <Input placeholder="Location" value={resumeData.basics.location} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, location: e.target.value } })} />
                    </Field>
                    <Field label="Summary" help="Two to three lines that connect your strengths to the target role.">
                        <Textarea placeholder="Professional Summary" value={resumeData.basics.summary} onChange={(e) => setResumeData({ ...resumeData, basics: { ...resumeData.basics, summary: e.target.value } })} rows={4} />
                    </Field>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Work Experience" icon={<Briefcase className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.work.map((exp, i) => (
                        <EntryPanel key={i} title={exp.position || "Untitled role"} meta={exp.company || "Add company"} defaultOpen={i === resumeData.work.length - 1}>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Company"><Input placeholder="Company" value={exp.company} onChange={(e) => { const w = [...resumeData.work]; w[i] = { ...w[i], company: e.target.value }; setResumeData({ ...resumeData, work: w }); }} /></Field>
                                <Field label="Role title"><Input placeholder="Position" value={exp.position} onChange={(e) => { const w = [...resumeData.work]; w[i] = { ...w[i], position: e.target.value }; setResumeData({ ...resumeData, work: w }); }} /></Field>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Start date"><Input placeholder="Jan 2023" value={exp.startDate} onChange={(e) => { const w = [...resumeData.work]; w[i] = { ...w[i], startDate: e.target.value }; setResumeData({ ...resumeData, work: w }); }} /></Field>
                                <Field label="End date"><Input placeholder="Present" value={exp.endDate} onChange={(e) => { const w = [...resumeData.work]; w[i] = { ...w[i], endDate: e.target.value }; setResumeData({ ...resumeData, work: w }); }} /></Field>
                            </div>
                            <Field label="Impact bullets" help="One result per line. Start with action, scope, and measurable outcome when possible."><Textarea placeholder="Improved onboarding flow, reducing drop-off by 18%" value={exp.highlights} onChange={(e) => { const w = [...resumeData.work]; w[i] = { ...w[i], highlights: e.target.value }; setResumeData({ ...resumeData, work: w }); }} rows={3} /></Field>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const w = resumeData.work.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, work: w }); }}><Trash2 className="w-4 h-4 mr-2" />Remove role</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, work: [...resumeData.work, { company: "", position: "", startDate: "", endDate: "", highlights: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Education" icon={<GraduationCap className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.education.map((edu, i) => (
                        <EntryPanel key={i} title={edu.institution || "Untitled education"} meta={[edu.studyType, edu.area].filter(Boolean).join(" in ") || "Add degree details"} defaultOpen={i === resumeData.education.length - 1}>
                            <Field label="Institution"><Input placeholder="Institution" value={edu.institution} onChange={(e) => { const ed = [...resumeData.education]; ed[i] = { ...ed[i], institution: e.target.value }; setResumeData({ ...resumeData, education: ed }); }} /></Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Degree"><Input placeholder="BSc, MBA, Certificate" value={edu.studyType} onChange={(e) => { const ed = [...resumeData.education]; ed[i] = { ...ed[i], studyType: e.target.value }; setResumeData({ ...resumeData, education: ed }); }} /></Field>
                                <Field label="Area of study"><Input placeholder="Computer Science" value={edu.area} onChange={(e) => { const ed = [...resumeData.education]; ed[i] = { ...ed[i], area: e.target.value }; setResumeData({ ...resumeData, education: ed }); }} /></Field>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Start date"><Input placeholder="2019" value={edu.startDate} onChange={(e) => { const ed = [...resumeData.education]; ed[i] = { ...ed[i], startDate: e.target.value }; setResumeData({ ...resumeData, education: ed }); }} /></Field>
                                <Field label="End date"><Input placeholder="2023" value={edu.endDate} onChange={(e) => { const ed = [...resumeData.education]; ed[i] = { ...ed[i], endDate: e.target.value }; setResumeData({ ...resumeData, education: ed }); }} /></Field>
                            </div>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const ed = resumeData.education.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, education: ed }); }}><Trash2 className="w-4 h-4 mr-2" />Remove education</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, education: [...resumeData.education, { institution: "", area: "", studyType: "", startDate: "", endDate: "", score: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Education</Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Skills" icon={<Lightbulb className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, i) => (
                            <div key={i} className="group flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-full text-sm border border-outline">
                                <span>{skill.name}</span>
                                <button onClick={() => { const s = resumeData.skills.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, skills: s }); }} className="text-on-surface-variant hover:text-error transition-colors">×</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Field label="Add skill" help="Press Enter after each skill. Keep them specific to the role."><Input placeholder="React, API design, stakeholder management..." onKeyDown={(e) => { if (e.key === "Enter") { const s = e.currentTarget.value.trim(); if (s) setResumeData({ ...resumeData, skills: [...resumeData.skills, { name: s, level: "", keywords: "" }] }); e.currentTarget.value = ""; } }} /></Field>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Projects" icon={<Briefcase className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.projects.map((proj, i) => (
                        <EntryPanel key={i} title={proj.name || "Untitled project"} meta={proj.url || "Add URL"} defaultOpen={i === resumeData.projects.length - 1}>
                            <Field label="Project Name"><Input placeholder="Orbit App" value={proj.name} onChange={(e) => { const p = [...resumeData.projects]; p[i] = { ...p[i], name: e.target.value }; setResumeData({ ...resumeData, projects: p }); }} /></Field>
                            <Field label="URL"><Input placeholder="https://..." value={proj.url} onChange={(e) => { const p = [...resumeData.projects]; p[i] = { ...p[i], url: e.target.value }; setResumeData({ ...resumeData, projects: p }); }} /></Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Start date"><Input placeholder="Jan 2023" value={proj.startDate} onChange={(e) => { const p = [...resumeData.projects]; p[i] = { ...p[i], startDate: e.target.value }; setResumeData({ ...resumeData, projects: p }); }} /></Field>
                                <Field label="End date"><Input placeholder="Present" value={proj.endDate} onChange={(e) => { const p = [...resumeData.projects]; p[i] = { ...p[i], endDate: e.target.value }; setResumeData({ ...resumeData, projects: p }); }} /></Field>
                            </div>
                            <Field label="Highlights"><Textarea placeholder="Built with React and Node.js..." value={proj.highlights} onChange={(e) => { const p = [...resumeData.projects]; p[i] = { ...p[i], highlights: e.target.value }; setResumeData({ ...resumeData, projects: p }); }} rows={3} /></Field>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const p = resumeData.projects.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, projects: p }); }}><Trash2 className="w-4 h-4 mr-2" />Remove project</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, projects: [...resumeData.projects, { name: "", description: "", highlights: "", url: "", startDate: "", endDate: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Project</Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Certifications" icon={<Award className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.certifications.map((cert, i) => (
                        <EntryPanel key={i} title={cert.name || "Untitled certification"} meta={cert.issuer || "Add issuer"} defaultOpen={i === resumeData.certifications.length - 1}>
                            <Field label="Certificate Name"><Input placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => { const c = [...resumeData.certifications]; c[i] = { ...c[i], name: e.target.value }; setResumeData({ ...resumeData, certifications: c }); }} /></Field>
                            <Field label="Issuer"><Input placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => { const c = [...resumeData.certifications]; c[i] = { ...c[i], issuer: e.target.value }; setResumeData({ ...resumeData, certifications: c }); }} /></Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Date"><Input placeholder="Jan 2023" value={cert.startDate} onChange={(e) => { const c = [...resumeData.certifications]; c[i] = { ...c[i], startDate: e.target.value }; setResumeData({ ...resumeData, certifications: c }); }} /></Field>
                                <Field label="URL"><Input placeholder="https://..." value={cert.url} onChange={(e) => { const c = [...resumeData.certifications]; c[i] = { ...c[i], url: e.target.value }; setResumeData({ ...resumeData, certifications: c }); }} /></Field>
                            </div>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const c = resumeData.certifications.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, certifications: c }); }}><Trash2 className="w-4 h-4 mr-2" />Remove certification</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, certifications: [...resumeData.certifications, { name: "", issuer: "", startDate: "", endDate: "", url: "", highlights: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Certification</Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Volunteer" icon={<Heart className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.volunteer.map((vol, i) => (
                        <EntryPanel key={i} title={vol.position || "New volunteer role"} meta={vol.organization || "Organization name"} defaultOpen={i === resumeData.volunteer.length - 1}>
                            <Field label="Organization"><Input placeholder="Red Cross" value={vol.organization} onChange={(e) => { const v = [...resumeData.volunteer]; v[i] = { ...v[i], organization: e.target.value }; setResumeData({ ...resumeData, volunteer: v }); }} /></Field>
                            <Field label="Role"><Input placeholder="Volunteer" value={vol.position} onChange={(e) => { const v = [...resumeData.volunteer]; v[i] = { ...v[i], position: e.target.value }; setResumeData({ ...resumeData, volunteer: v }); }} /></Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Start date"><Input placeholder="Jan 2023" value={vol.startDate} onChange={(e) => { const v = [...resumeData.volunteer]; v[i] = { ...v[i], startDate: e.target.value }; setResumeData({ ...resumeData, volunteer: v }); }} /></Field>
                                <Field label="End date"><Input placeholder="Present" value={vol.endDate} onChange={(e) => { const v = [...resumeData.volunteer]; v[i] = { ...v[i], endDate: e.target.value }; setResumeData({ ...resumeData, volunteer: v }); }} /></Field>
                            </div>
                            <Field label="Impact bullets" help="One result per line. Describe your contributions and outcomes."><Textarea placeholder="Organized community food drive serving 200+ families" value={vol.highlights} onChange={(e) => { const v = [...resumeData.volunteer]; v[i] = { ...v[i], highlights: e.target.value }; setResumeData({ ...resumeData, volunteer: v }); }} rows={3} /></Field>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const v = resumeData.volunteer.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, volunteer: v }); }}><Trash2 className="w-4 h-4 mr-2" />Remove volunteer</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, volunteer: [...resumeData.volunteer, { organization: "", position: "", startDate: "", endDate: "", highlights: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Volunteer</Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Languages" icon={<Globe className="w-4 h-4" />} defaultOpen={false}>
                <div className="space-y-4">
                    {resumeData.languages.map((lang, i) => (
                        <EntryPanel key={i} title={lang.name || "New language"} meta={lang.fluency || "Proficiency level"} defaultOpen={i === resumeData.languages.length - 1}>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Language"><Input placeholder="English" value={lang.name} onChange={(e) => { const l = [...resumeData.languages]; l[i] = { ...l[i], name: e.target.value }; setResumeData({ ...resumeData, languages: l }); }} /></Field>
                                <Field label="Fluency"><Input placeholder="Native" value={lang.fluency} onChange={(e) => { const l = [...resumeData.languages]; l[i] = { ...l[i], fluency: e.target.value }; setResumeData({ ...resumeData, languages: l }); }} /></Field>
                            </div>
                            <Field label="Proficiency details" help="Optional. Add certifications, test scores, or contextual details."><Textarea placeholder="IELTS 8.0, 10 years professional use" value={lang.highlights} onChange={(e) => { const l = [...resumeData.languages]; l[i] = { ...l[i], highlights: e.target.value }; setResumeData({ ...resumeData, languages: l }); }} rows={2} /></Field>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10 w-full" onClick={() => { const l = resumeData.languages.filter((_, idx) => idx !== i); setResumeData({ ...resumeData, languages: l }); }}><Trash2 className="w-4 h-4 mr-2" />Remove language</Button>
                        </EntryPanel>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, languages: [...resumeData.languages, { name: "", fluency: "", highlights: "", startDate: "" }] })}><Plus className="w-4 h-4 mr-2" />Add Language</Button>
                </div>
            </CollapsibleSection>
        </main>
    );

    const coverLetterForm = (
        <main className="lg:col-span-4 overflow-y-auto p-6 space-y-6 bg-surface border-r border-outline">
            <CollapsibleSection title="Recipient Details" icon={<User className="w-4 h-4" />} defaultOpen={true}>
                <div className="space-y-4">
                    <Field label="Your Name" help="Shown under the sign-off.">
                        <Input placeholder="e.g. Jane Smith" value={coverLetterData.senderName} onChange={(e) => setCoverLetterData({ ...coverLetterData, senderName: e.target.value })} />
                    </Field>
                    <Field label="Recipient Name" help="Leave blank if you do not know the hiring manager.">
                        <Input placeholder="e.g. John Doe" value={coverLetterData.recipientName} onChange={(e) => setCoverLetterData({ ...coverLetterData, recipientName: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Recipient Title">
                            <Input placeholder="e.g. Hiring Manager" value={coverLetterData.recipientTitle} onChange={(e) => setCoverLetterData({ ...coverLetterData, recipientTitle: e.target.value })} />
                        </Field>
                        <Field label="Company">
                            <Input placeholder="e.g. Acme Inc." value={coverLetterData.company} onChange={(e) => setCoverLetterData({ ...coverLetterData, company: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Company Address" help="Optional. Include it only when you want a formal letter layout.">
                        <Input placeholder="e.g. 123 Tech Lane, San Francisco, CA" value={coverLetterData.address} onChange={(e) => setCoverLetterData({ ...coverLetterData, address: e.target.value })} />
                    </Field>
                    <Field label="Recipient Email" help="Optional internal reference for where this letter is going.">
                        <Input placeholder="e.g. hiring@acme.com" value={coverLetterData.email} onChange={(e) => setCoverLetterData({ ...coverLetterData, email: e.target.value })} />
                    </Field>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Letter Content" icon={<Mail className="w-4 h-4" />} defaultOpen={true}>
                <div className="space-y-4">
                    <Field label="Opening Paragraph" help="Name the role and quickly state why this company or problem interests you.">
                        <Textarea placeholder="How did you find this role? Why are you interested?" value={coverLetterData.opening} onChange={(e) => setCoverLetterData({ ...coverLetterData, opening: e.target.value })} rows={4} />
                    </Field>
                    <Field label="Body Paragraphs" help="Use one paragraph per proof point. The preview keeps line breaks as paragraphs.">
                        <Textarea placeholder="Highlight your relevant experience and skills..." value={coverLetterData.body} onChange={(e) => setCoverLetterData({ ...coverLetterData, body: e.target.value })} rows={10} />
                    </Field>
                    <Field label="Closing Paragraph" help="Close with confidence and a clear next step.">
                        <Textarea placeholder="Call to action and thank you..." value={coverLetterData.closing} onChange={(e) => setCoverLetterData({ ...coverLetterData, closing: e.target.value })} rows={4} />
                    </Field>
                    <Field label="Sign-off" help="Examples: Best regards, Sincerely, Thank you.">
                        <Input placeholder="e.g. Sincerely," value={coverLetterData.signature} onChange={(e) => setCoverLetterData({ ...coverLetterData, signature: e.target.value })} />
                    </Field>
                </div>
            </CollapsibleSection>
        </main>
    );    return (
        <div className="min-h-screen pt-[64px] flex flex-col bg-surface">
            <div className="h-16 border-b border-outline/50 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4 min-w-0">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate("/app/resumes")}
                        className="rounded-full shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="h-6 w-px bg-outline/50 shrink-0" />
                    <div className="flex items-center gap-3 min-w-0">
                        {isEditingName ? (
                            <input 
                                autoFocus 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)} 
                                onBlur={() => { if (!newName.trim()) setNewName(document.name); setIsEditingName(false); }} 
                                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setNewName(document.name); setIsEditingName(false); } }} 
                                className="bg-transparent border-b-2 border-primary outline-none font-bold text-lg px-1 py-0.5 text-on-surface" 
                            />
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditingName(true)}>
                                <h1 className="font-bold text-lg tracking-tight text-on-surface truncate max-w-48 group-hover:text-primary transition-colors">
                                    {newName || document.name}
                                </h1>
                                <Pencil className="size-3.5 text-on-surface-variant/40 group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        )}
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 text-label-sm font-bold uppercase tracking-wider text-primary border border-primary/10 shrink-0">
                            <div className={`w-1 h-1 rounded-full ${docType === "COVER_LETTER" ? "bg-amber-500" : "bg-primary"}`} />
                            {docType === "COVER_LETTER" ? "Cover Letter" : "Resume"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 lg:hidden"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleDownloadPdf} 
                        disabled={isDownloading}
                    >
                        {isDownloading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                        Export
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={() => handleSave()} 
                        disabled={updateResume.isPending}
                    >
                        {updateResume.isPending ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                {docType === "COVER_LETTER" ? coverLetterForm : resumeForm}
                <div className="hidden lg:flex lg:col-span-8 overflow-hidden bg-surface-container-low justify-center items-start p-8 relative">
                    <div className="w-full h-full max-w-[900px] shadow-lg rounded-sm overflow-hidden ring-1 ring-outline/50">
                        <PreviewBuffer
                            document={document}
                            docType={docType}
                            resumeData={resumeData}
                            coverLetterData={coverLetterData}
                            settings={settings}
                        />
                    </div>
                </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="lg:hidden max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-4 py-3 border-b"><DialogTitle className="text-sm font-semibold">Preview</DialogTitle></DialogHeader>
                    <div className="relative flex-1 overflow-hidden">
                        <PreviewBuffer
                            document={document}
                            docType={docType}
                            resumeData={resumeData}
                            coverLetterData={coverLetterData}
                            settings={settings}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CollapsibleSection({ title, icon, defaultOpen, description, children }: { title: string; icon: React.ReactNode; defaultOpen?: boolean; description?: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen ?? false);
    return (
        <div className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
            open ? "border-primary/10 bg-surface" : "border-outline bg-surface-container-low/30 hover:bg-surface-container-low/50"
        }`}>
            <button 
                type="button" 
                onClick={() => setOpen(!open)} 
                aria-expanded={open}
                aria-label={`${title} section, ${open ? 'expanded' : 'collapsed'}`}
                className="w-full flex items-center justify-between p-6 transition-all group"
            >
                <div className="flex items-start gap-4">
                                 <div className={`mt-0.5 p-2 rounded-xl transition-all duration-500 ${
                                     open ? "bg-primary text-on-primary scale-110 shadow-lg shadow-primary/20" : "bg-primary-container/30 text-primary group-hover:scale-110"
                                 }`}>
                        {icon}
                    </div>
                    <div>
                        <span className={`block font-bold tracking-tight transition-colors duration-500 ${
                            open ? "text-lg text-on-surface" : "text-on-surface/70"
                        }`}>
                            {title}
                        </span>
                        {description && <span className="mt-1 block text-xs font-medium text-on-surface-variant/60">{description}</span>}
                    </div>
                </div>
                <div className={`transition-transform duration-500 ${open ? "rotate-180 text-primary" : "text-on-surface-variant/40"}`}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 space-y-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-outline/50 to-transparent mb-6" />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EntryPanel({ title, meta, defaultOpen, children }: { title: string; meta?: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen ?? false);

    return (
        <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
            open ? "border-primary/20 bg-surface shadow-lg" : "border-outline bg-surface-container-low/50 hover:border-outline-variant"
        }`}>
            <button 
                type="button" 
                onClick={() => setOpen(!open)} 
                aria-expanded={open}
                aria-label={`${title}, ${open ? 'expanded' : 'collapsed'}`}
                className="flex w-full items-center justify-between gap-4 p-5 text-left group"
            >
                <div className="min-w-0">
                    <span className={`block truncate font-bold transition-colors ${
                        open ? "text-primary" : "text-on-surface/80 group-hover:text-on-surface"
                    }`}>
                        {title}
                    </span>
                    {meta && <span className="mt-1 block truncate text-xs font-medium text-on-surface-variant/50">{meta}</span>}
                </div>
                <div className={`transition-all duration-300 ${open ? "rotate-180 text-primary" : "text-on-surface-variant/30 group-hover:text-on-surface-variant"}`}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 space-y-4 bg-surface-container-low/20">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}    function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2 group">
            <Label className="text-xs font-bold uppercase tracking-wider text-primary/60 group-focus-within:text-primary transition-colors">{label}</Label>
            {help && <p className="text-label-sm leading-relaxed text-on-surface-variant/50 italic">{help}</p>}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}    function SegmentedControl({ label, description, value, options, onChange }: { label: string; description?: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
    return (
        <div className="space-y-3">
            <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-primary/60">{label}</Label>
                {description && <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/70 italic">{description}</p>}
            </div>
            <div className="relative grid grid-cols-3 gap-1 rounded-2xl bg-surface-container-high/50 p-1.5">
                {options.map((option) => {
                    const isActive = value === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`relative rounded-xl px-3 py-2.5 text-xs font-bold capitalize transition-all duration-300 z-10 ${
                                isActive
                                    ? "text-primary shadow-sm"
                                    : "text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container"
                            }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-surface rounded-xl -z-10 shadow-sm animate-in fade-in zoom-in-95 duration-300" />
                            )}
                            <span className="relative">{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


