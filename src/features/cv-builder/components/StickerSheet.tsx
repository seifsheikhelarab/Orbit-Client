interface ResumeContent {
    basics?: {
        name?: string;
        label?: string;
        email?: string;
        phone?: string;
        location?: string;
        summary?: string;
    };
    work?: Array<{
        company?: string;
        position?: string;
        startDate?: string;
        endDate?: string;
        highlights?: string;
    }>;
    education?: Array<{
        institution?: string;
        area?: string;
        studyType?: string;
    }>;
    skills?: Array<{
        name?: string;
        level?: string;
    }>;
    languages?: Array<{
        name?: string;
        fluency?: string;
    }>;
    projects?: Array<{
        name?: string;
        description?: string;
    }>;
}

interface CoverLetterContent {
    senderName?: string;
    recipientName?: string;
    recipientTitle?: string;
    company?: string;
    opening?: string;
    body?: string;
    closing?: string;
    signature?: string;
}

interface StickerSheetProps {
    type: "RESUME" | "COVER_LETTER";
    content: Record<string, unknown>;
    settings?: { color?: string };
    name?: string;
}

export function StickerSheet({ type, content, settings, name }: StickerSheetProps) {
    const accentColor = settings?.color || "#1a1a2e";
    const resumeContent = content as ResumeContent;
    const clContent = content as CoverLetterContent;

    if (type === "COVER_LETTER") {
        return <CoverLetterStickers content={clContent} name={name} />;
    }

    return <ResumeStickers content={resumeContent} name={name} accentColor={accentColor} />;
}

function ResumeStickers({ content, name, accentColor }: { content: ResumeContent; name?: string; accentColor: string }) {
    const { basics, work, education, skills, languages } = content;
    const displayName = basics?.name || name || "Untitled";
    const title = basics?.label || "Add target title";
    const hasContact = basics?.email || basics?.phone || basics?.location;
    const workEntries = work?.slice(0, 2) || [];
    const eduEntries = education?.slice(0, 1) || [];
    const skillItems = skills?.slice(0, 8) || [];

    return (
        <div className="absolute inset-0 p-4 flex flex-col gap-2 overflow-hidden">
            {/* Name sticker — large colored block */}
            <div
                className="rounded-lg p-3 shadow-sm"
                style={{ backgroundColor: accentColor + "12" }}
            >
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <p
                            className="text-xs font-extrabold tracking-tight truncate"
                            style={{ color: accentColor }}
                        >
                            {displayName}
                        </p>
                        {title && (
                            <p className="text-[8px] font-semibold text-on-surface-variant/70 truncate mt-0.5">
                                {title}
                            </p>
                        )}
                    </div>
                    {/* Washi tape tab */}
                    <div
                        className="size-3 rounded-sm shrink-0 mt-0.5 opacity-60"
                        style={{ backgroundColor: accentColor }}
                    />
                </div>
                {/* Summary snippet */}
                {basics?.summary && (
                    <p className="text-[7px] leading-relaxed text-on-surface-variant/50 mt-1.5 line-clamp-2 border-t border-outline-variant/30 pt-1.5">
                        {basics.summary}
                    </p>
                )}
            </div>

            {/* Contact chips */}
            {hasContact && (
                <div className="flex flex-wrap gap-1">
                    {basics?.email && (
                        <span className="px-1.5 py-0.5 rounded-md bg-accent-container/50 text-[6px] font-bold uppercase tracking-wider text-accent border border-accent/10">
                            {basics.email.length > 18 ? basics.email.slice(0, 16) + "…" : basics.email}
                        </span>
                    )}
                    {basics?.phone && (
                        <span className="px-1.5 py-0.5 rounded-md bg-accent-container/30 text-[6px] font-bold uppercase tracking-wider text-accent/70 border border-accent/5">
                            {basics.phone}
                        </span>
                    )}
                    {basics?.location && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary-container/50 text-[6px] font-bold uppercase tracking-wider text-primary/60">
                            {basics.location.length > 14 ? basics.location.slice(0, 12) + "…" : basics.location}
                        </span>
                    )}
                </div>
            )}

            {/* Work experience stickers */}
            {workEntries.length > 0 && (
                <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                    {/* Section tab */}
                    <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-0.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                        <span className="text-[6px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                            Experience
                        </span>
                        <div className="flex-1 h-px bg-outline-variant/30" />
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                        {workEntries.map((entry, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-outline-variant/30 bg-surface/80 p-2 shadow-xs"
                            >
                                <div className="flex items-center justify-between gap-1">
                                    <p className="text-[7px] font-bold text-on-surface truncate">
                                        {entry.position || "Role"}
                                    </p>
                                    {entry.startDate && (
                                        <span className="text-[6px] text-on-surface-variant/50 shrink-0">
                                            {entry.startDate}
                                        </span>
                                    )}
                                </div>
                                {entry.company && (
                                    <p className="text-[6px] font-medium text-primary/60 truncate">
                                        {entry.company}
                                    </p>
                                )}
                                {entry.highlights && (
                                    <p className="text-[6px] leading-relaxed text-on-surface-variant/50 mt-1 line-clamp-2 border-t border-outline-variant/20 pt-1">
                                        {entry.highlights.split("\n").slice(0, 2).join(" · ")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills stickers — pill badges */}
            {skillItems.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {skillItems.map((skill, i) => (
                        <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-full text-[6px] font-bold uppercase tracking-wider border"
                            style={{
                                backgroundColor: accentColor + "08",
                                color: accentColor + "cc",
                                borderColor: accentColor + "15",
                            }}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Education sticker */}
            {eduEntries.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-primary-container/20 border border-primary-container/40 px-2 py-1.5">
                    <div className="size-3 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <div className="size-1.5 rounded-full bg-primary/40" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[7px] font-bold text-on-surface truncate">
                            {eduEntries[0].institution || "University"}
                        </p>
                        {eduEntries[0].studyType && (
                            <p className="text-[6px] text-on-surface-variant/50 truncate">
                                {eduEntries[0].studyType}{eduEntries[0].area ? ` in ${eduEntries[0].area}` : ""}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <div className="flex gap-1.5">
                    {languages.slice(0, 3).map((lang, i) => (
                        <span key={i} className="text-[6px] font-medium text-on-surface-variant/40 truncate border-r border-outline-variant/20 pr-1.5 last:border-r-0 last:pr-0">
                            {lang.name}{lang.fluency ? ` (${lang.fluency})` : ""}
                        </span>
                    ))}
                </div>
            )}

            {/* Bottom tape accent */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-20"
                style={{ backgroundColor: accentColor }}
            />
        </div>
    );
}

function CoverLetterStickers({ content, name }: { content: CoverLetterContent; name?: string }) {
    const sender = content.senderName || name || "Your Name";
    const recipient = content.recipientName || "Hiring Manager";
    const company = content.company || "Company";
    const hasBody = content.opening || content.body || content.closing;

    return (
        <div className="absolute inset-0 p-4 flex flex-col gap-2 overflow-hidden">
            {/* Letter type header */}
            <div className="rounded-lg bg-amber-50 border border-amber-200/60 p-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-amber-200/60 flex items-center justify-center">
                        <span className="text-[8px]">✉</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-extrabold text-amber-800 tracking-tight">Cover Letter</p>
                        <p className="text-[6px] font-medium text-amber-600/60">{company}</p>
                    </div>
                </div>
            </div>

            {/* Recipient sticker */}
            <div className="rounded-lg border border-outline-variant/30 bg-surface/80 p-2 shadow-xs">
                <p className="text-[6px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-1">To</p>
                <p className="text-[8px] font-bold text-on-surface truncate">{recipient}</p>
                {company && (
                    <p className="text-[7px] text-on-surface-variant/60 truncate">{company}</p>
                )}
                {content.recipientTitle && (
                    <p className="text-[6px] text-on-surface-variant/40 truncate">{content.recipientTitle}</p>
                )}
            </div>

            {/* Paperclip + body text */}
            {hasBody && (
                <div className="flex-1 flex flex-col gap-1.5 min-h-0 relative">
                    {/* Decorative paperclip */}
                    <div className="absolute -left-0.5 top-1 text-label-sm text-on-surface-variant/20 select-none">📎</div>

                    {/* Opening snippet */}
                    {content.opening && (
                        <div className="ml-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/20 p-2 shadow-xs">
                            <p className="text-[7px] leading-relaxed text-on-surface-variant/60 line-clamp-3 italic">
                                "{content.opening.slice(0, 100)}{content.opening.length > 100 ? "…" : ""}"
                            </p>
                        </div>
                    )}

                    {/* Divider tape */}
                    <div className="flex items-center gap-1 px-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-amber-200/40 via-amber-300/30 to-transparent" />
                    </div>

                    {/* Signature sticker */}
                    <div className="ml-2.5 rounded-lg bg-surface border border-amber-100/40 p-2 shadow-xs">
                        <p className="text-[8px] font-bold text-amber-800/70" style={{ fontFamily: "serif" }}>
                            {sender}
                        </p>
                        {content.signature && (
                            <p className="text-[6px] text-on-surface-variant/40 mt-0.5">{content.signature}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Body snippet at bottom */}
            {content.body && (
                <div className="rounded-md bg-primary-container/10 border border-primary-container/30 px-2 py-1.5">
                    <p className="text-[6px] leading-relaxed text-on-surface-variant/45 line-clamp-2">
                        {content.body.slice(0, 120)}{content.body.length > 120 ? "…" : ""}
                    </p>
                </div>
            )}

            {/* Bottom envelope motif */}
            <div className="flex justify-center">
                <div className="w-6 h-4 rounded-sm border border-amber-200/40 flex items-center justify-center">
                    <div className="w-3 h-2 border-t border-l border-amber-200/30" />
                </div>
            </div>
        </div>
    );
}
