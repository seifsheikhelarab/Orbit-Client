import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Trash2, ArrowLeft, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Textarea, Label } from "@/components/ui"
import { Card } from "@/components/ui/card"
import { QuickStatusSelect } from "@/components/shared/QuickStatusSelect"
import type { Application } from "@/components/kanban/KanbanBoard"

const applicationSchema = z.object({
    company: z.string().trim().min(1, "Company name is required").max(200),
    jobTitle: z.string().trim().min(1, "Job title is required").max(200),
    applicationStatus: z.enum(["SAVED", "APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER", "CLOSED"]),
    jobURL: z.string().optional(),
    location: z.string().optional(),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    appliedDate: z.string().optional(),
    notes: z.string().optional(),
    followUpDate: z.string().optional(),
    followUpNote: z.string().optional(),
    source: z.string().optional()
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

interface ApplicationFormProps {
    initialData?: Application
    onSubmit: (data: ApplicationFormValues) => Promise<void>
    isSubmitting: boolean
    onDelete?: () => Promise<void>
    isDeleting?: boolean
    defaultStatus?: string | null
}

export function ApplicationForm({
    initialData,
    onSubmit,
    isSubmitting,
    onDelete,
    isDeleting,
    defaultStatus
}: ApplicationFormProps) {
    const navigate = useNavigate()

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        mode: "onChange",
        defaultValues: {
            company: initialData?.company || "",
            jobTitle: initialData?.jobTitle || "",
            applicationStatus: (initialData?.applicationStatus || defaultStatus || "SAVED") as ApplicationFormValues["applicationStatus"],
            jobURL: initialData?.jobURL || "",
            location: initialData?.location || "",
            salaryMin: initialData?.salaryMin?.toString() || "",
            salaryMax: initialData?.salaryMax?.toString() || "",
            appliedDate: initialData?.appliedDate
                ? new Date(initialData.appliedDate).toISOString().split("T")[0]
                : "",
            notes: initialData?.notes || "",
            followUpDate: initialData?.followUpDate
                ? new Date(initialData.followUpDate).toISOString().split("T")[0]
                : "",
            followUpNote: initialData?.followUpNote || "",
            source: initialData?.source || ""
        }
    })

    const isDirty = form.formState.isDirty;

    useEffect(() => {
        if (!isDirty) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return (
        <div className="max-w-2xl mx-auto animate-page-enter">
            <div className="flex items-center justify-between mb-8 border-b border-outline pb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/app/applications")}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                {onDelete && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                    </Button>
                )}
            </div>

            <Card variant="default" className="p-8 sm:p-10 border border-outline">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company" required>Company</Label>
                            <Controller
                                name="company"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        id="company"
                                        placeholder="Acme Corp"
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle" required>Job Title</Label>
                            <Controller
                                name="jobTitle"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        id="jobTitle"
                                        placeholder="Backend Engineer"
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicationStatus" required>Status</Label>
                        <QuickStatusSelect
                            value={form.watch("applicationStatus")}
                            onChange={(status) => form.setValue("applicationStatus", status, { shouldDirty: true, shouldValidate: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobURL">Job URL</Label>
                        <Controller
                            name="jobURL"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="jobURL"
                                    type="url"
                                    placeholder="https://..."
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Controller
                                name="location"
                                control={form.control}
                                render={({ field }) => (
                                    <Input {...field} id="location" placeholder="Remote, New York, etc." />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appliedDate">Applied Date</Label>
                            <Controller
                                name="appliedDate"
                                control={form.control}
                                render={({ field }) => (
                                    <Input {...field} id="appliedDate" type="date" />
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="salaryMin">Min Salary</Label>
                            <Controller
                                name="salaryMin"
                                control={form.control}
                                render={({ field }) => (
                                    <Input {...field} id="salaryMin" type="number" placeholder="80000" />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salaryMax">Max Salary</Label>
                            <Controller
                                name="salaryMax"
                                control={form.control}
                                render={({ field }) => (
                                    <Input {...field} id="salaryMax" type="number" placeholder="120000" />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Controller
                            name="source"
                            control={form.control}
                            render={({ field }) => (
                                <Input {...field} id="source" placeholder="LinkedIn, Indeed, Referral..." />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Controller
                            name="notes"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="notes"
                                    rows={4}
                                    placeholder="Any context, referrals, or interview details..."
                                />
                            )}
                        />
                    </div>

                    <div className="border-t border-outline pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold">Follow-up Reminder</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="followUpDate">Follow-up Date</Label>
                                <div className="relative">
                                    <Controller
                                        name="followUpDate"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input {...field} id="followUpDate" type="date" />
                                        )}
                                    />
                                    {form.watch("followUpDate") && (
                                        <button
                                            type="button"
                                            onClick={() => form.setValue("followUpDate", "", { shouldDirty: true, shouldValidate: true })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="followUpNote">Note</Label>
                                <Controller
                                    name="followUpNote"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input {...field} id="followUpNote" placeholder="Ask about timeline..." />
                                    )}
                                />
                            </div>
                        </div>

                        {form.watch("followUpDate") && new Date(form.watch("followUpDate")!) < new Date(new Date().toDateString()) && (
                            <div className="mt-3 flex items-center gap-2 text-error text-sm">
                                <span className="bg-error-container px-2 py-1 rounded-lg">Overdue</span>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {initialData ? "Save Changes" : "Create Application"}
                            </>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    )
}
