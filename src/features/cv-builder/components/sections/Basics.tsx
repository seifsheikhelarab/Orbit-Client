import { useEffect, useRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeData } from "../../types";
import { User } from "lucide-react";

interface BasicsProps {
    register: UseFormRegister<ResumeData>;
}

function AutoResizeTextarea({
    register,
    name,
    placeholder,
}: {
    register: UseFormRegister<ResumeData>;
    name: "basics.summary";
    placeholder: string;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { ref: reactHookRef, ...rest } = register(name);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        const resize = () => {
            el.style.height = "auto";
            el.style.height = `${Math.max(80, el.scrollHeight)}px`;
        };
        resize();
        el.addEventListener("input", resize);
        return () => el.removeEventListener("input", resize);
    }, []);

    return (
        <textarea
            ref={(e) => {
                reactHookRef(e);
                (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = e;
            }}
            {...rest}
            placeholder={placeholder}
            className="flex w-full rounded-lg border-none bg-surface-container px-4 py-3 text-sm ring-offset-background placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 mt-1 resize-none overflow-hidden min-h-[100px]"
            rows={3}
        />
    );
}

export function Basics({ register }: BasicsProps) {
    return (
        <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline/30 bg-surface-container-low/50">
                <div className="p-2 rounded-lg bg-accent/10">
                    <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-on-surface">Personal Info</h2>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-bold">The Basics</p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-name" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">First & Last Name</Label>
                        <Input
                            id="basics-name"
                            {...register("basics.name")}
                            placeholder="Alex Morgan"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-label" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Professional Title</Label>
                        <Input
                            id="basics-label"
                            {...register("basics.label")}
                            placeholder="Senior UX Designer"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-email" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Email Address</Label>
                        <Input
                            id="basics-email"
                            {...register("basics.email")}
                            type="email"
                            placeholder="alex.m@orbit.com"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-phone" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Phone Number</Label>
                        <Input
                            id="basics-phone"
                            {...register("basics.phone")}
                            placeholder="+1 (555) 123-4567"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-location" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Location</Label>
                        <Input
                            id="basics-location"
                            {...register("basics.location")}
                            placeholder="San Francisco, CA"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <Label htmlFor="basics-url" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Personal Website / Portfolio</Label>
                        <Input
                            id="basics-url"
                            {...register("basics.url")}
                            placeholder="https://alexmorgan.design"
                            className="bg-surface-container border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-11 px-4 placeholder:text-on-surface-variant"
                        />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label htmlFor="basics-summary" className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tight">Professional Summary</Label>
                        <AutoResizeTextarea
                            register={register}
                            name="basics.summary"
                            placeholder="Strategic Product Designer with over 7 years of experience in creating user-centered digital products..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
