import { UseFormRegister, Control, useWatch, UseFormSetValue } from "react-hook-form";
import { ResumeData } from "../../types";
import { Label } from "@/components/ui/label";
import { Palette, Check } from "lucide-react";

interface Props {
    register: UseFormRegister<ResumeData>;
    control: Control<ResumeData>;
    setValue: UseFormSetValue<ResumeData>;
}

function TemplatePreview({ type }: { type: "modern" | "professional" | "minimal" }) {
    if (type === "modern") {
        return (
            <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
                <rect x="0" y="0" width="20" height="80" fill="currentColor" opacity="0.15" rx="1" />
                <rect x="24" y="8" width="28" height="3" fill="currentColor" opacity="0.4" rx="1" />
                <rect x="24" y="14" width="20" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="24" y="22" width="28" height="2" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="24" y="26" width="22" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="24" y="30" width="25" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="24" y="38" width="28" height="2" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="24" y="42" width="18" height="2" fill="currentColor" opacity="0.15" rx="1" />
                <rect x="24" y="46" width="22" height="2" fill="currentColor" opacity="0.15" rx="1" />
            </svg>
        );
    }
    if (type === "professional") {
        return (
            <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
                <rect x="0" y="0" width="60" height="20" fill="currentColor" opacity="0.15" rx="1" />
                <rect x="10" y="6" width="40" height="4" fill="currentColor" opacity="0.5" rx="1" />
                <rect x="18" y="13" width="24" height="2" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="4" y="26" width="52" height="2" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="4" y="30" width="40" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="4" y="34" width="48" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="4" y="42" width="52" height="2" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="4" y="46" width="35" height="2" fill="currentColor" opacity="0.2" rx="1" />
                <rect x="4" y="50" width="44" height="2" fill="currentColor" opacity="0.2" rx="1" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
            <rect x="4" y="6" width="32" height="4" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="4" y="13" width="22" height="2" fill="currentColor" opacity="0.25" rx="1" />
            <rect x="4" y="20" width="52" height="0.5" fill="currentColor" opacity="0.3" />
            <rect x="4" y="26" width="52" height="2" fill="currentColor" opacity="0.25" rx="1" />
            <rect x="4" y="30" width="42" height="2" fill="currentColor" opacity="0.15" rx="1" />
            <rect x="4" y="34" width="48" height="2" fill="currentColor" opacity="0.15" rx="1" />
            <rect x="4" y="42" width="52" height="2" fill="currentColor" opacity="0.25" rx="1" />
            <rect x="4" y="46" width="36" height="2" fill="currentColor" opacity="0.15" rx="1" />
        </svg>
    );
}

const TEMPLATES = [
    { value: "modern", label: "Modern", description: "Accent sidebar" },
    { value: "professional", label: "Professional", description: "Centered header" },
    { value: "minimal", label: "Minimal", description: "Clean layout" },
] as const;

const FONT_SIZES = [
    { value: "small", label: "S", fullLabel: "Small" },
    { value: "medium", label: "M", fullLabel: "Medium" },
    { value: "large", label: "L", fullLabel: "Large" },
] as const;

const LINE_SPACINGS = [
    { value: "compact", label: "1.0" },
    { value: "normal", label: "1.2" },
    { value: "relaxed", label: "1.5" },
] as const;

const MARGINS = [
    { value: "narrow", label: "10" },
    { value: "normal", label: "20" },
    { value: "wide", label: "30" },
] as const;

export function ThemeCustomizer({ register, control, setValue }: Props) {
    const template = useWatch({ control, name: "settings.template" });
    const color = useWatch({ control, name: "settings.color" }) || "#4f46e5";
    const fontSize = useWatch({ control, name: "settings.fontSize" }) || "medium";
    const lineSpacing = useWatch({ control, name: "settings.lineSpacing" }) || "normal";
    const margin = useWatch({ control, name: "settings.margin" }) || "normal";

    const handleColorClick = (preset: string) => {
        setValue("settings.color", preset, { shouldValidate: true });
    };

    return (
        <div className="bg-card rounded-xl border border-outline overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-on-surface">Theme & Layout</h2>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Visual Settings</p>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Templates */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Choose Template</Label>
                    <div className="grid grid-cols-3 gap-3">
                        {TEMPLATES.map(({ value, label }) => {
                            const isSelected = template === value;
                            return (
                                <label
                                    key={value}
                                    className={`relative cursor-pointer group rounded-xl border-2 transition-all p-3 text-center ${
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-outline hover:border-outline-variant bg-surface-container-low"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value={value}
                                        {...register("settings.template")}
                                        className="sr-only"
                                    />
                                    <div className={`mx-auto mb-2 w-12 h-16 ${isSelected ? "text-primary" : "text-outline"}`}>
                                        <TemplatePreview type={value} />
                                    </div>
                                    <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                                        {label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Accent Color</Label>
                    <div className="flex flex-wrap items-center gap-3">
                        {["#4f46e5", "#0f766e", "#7c3aed", "#be185d", "#b45309", "#374151"].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => handleColorClick(preset)}
                                aria-label={`Select color ${preset}`}
                                className={`group relative w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                                    color === preset ? "ring-2 ring-primary ring-offset-2" : ""
                                }`}
                                style={{ backgroundColor: preset }}
                            >
                                {color === preset && <Check className="w-4 h-4 text-on-primary" />}
                            </button>
                        ))}
                        <div className="relative ml-2">
                            <input
                                type="color"
                                {...register("settings.color")}
                                className="sr-only"
                                id="custom-color-picker"
                            />
                            <label
                                htmlFor="custom-color-picker"
                                className="w-8 h-8 rounded-full border-2 border-dashed border-outline flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                style={!["#4f46e5", "#0f766e", "#7c3aed", "#be185d", "#b45309", "#374151"].includes(color) ? { backgroundColor: color, borderStyle: 'solid' } : {}}
                            >
                                {!["#4f46e5", "#0f766e", "#7c3aed", "#be185d", "#b45309", "#374151"].includes(color) ? (
                                    <Check className="w-4 h-4 text-on-primary" />
                                ) : (
                                    <span className="text-outline text-lg leading-none">+</span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Typography & Spacing */}
                <div className="grid grid-cols-3 gap-6 pt-2 border-t border-outline-variant">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Size</Label>
                        <div className="flex bg-surface-container rounded-lg p-1">
                            {FONT_SIZES.map(({ value, label }) => {
                                const isSelected = fontSize === value;
                                return (
                                    <label key={value} className="flex-1 cursor-pointer">
                                        <input type="radio" {...register("settings.fontSize")} value={value} className="sr-only" />
                                        <div className={`py-1.5 text-center rounded-md text-[10px] font-bold transition-all ${
                                            isSelected ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                                        }`}>
                                            {label}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Spacing</Label>
                        <div className="flex bg-surface-container rounded-lg p-1">
                            {LINE_SPACINGS.map(({ value, label }) => {
                                const isSelected = lineSpacing === value;
                                return (
                                    <label key={value} className="flex-1 cursor-pointer">
                                        <input type="radio" {...register("settings.lineSpacing")} value={value} className="sr-only" />
                                        <div className={`py-1.5 text-center rounded-md text-[10px] font-bold transition-all ${
                                            isSelected ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                                        }`}>
                                            {label}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Margins</Label>
                        <div className="flex bg-surface-container rounded-lg p-1">
                            {MARGINS.map(({ value, label }) => {
                                const isSelected = margin === value;
                                return (
                                    <label key={value} className="flex-1 cursor-pointer">
                                        <input type="radio" {...register("settings.margin")} value={value} className="sr-only" />
                                        <div className={`py-1.5 text-center rounded-md text-[10px] font-bold transition-all ${
                                            isSelected ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                                        }`}>
                                            {label}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
