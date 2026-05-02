import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Trash2, ArrowLeft, Calendar, X } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input, Textarea, Label } from "@/components/ui"
import { Card } from "@/components/ui/card"
import { QuickStatusSelect } from "@/components/shared/QuickStatusSelect"
import type { Application } from "@/components/kanban/KanbanBoard"

const applicationSchema = z.object({
    company: z.string().min(1, "Company name is required").max(200),
    jobTitle: z.string().min(1, "Job title is required").max(200),
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
        >
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
                            <Input
                                id="company"
                                placeholder="Acme Corp"
                                error={form.formState.errors.company?.message}
                                {...form.register("company")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle" required>Job Title</Label>
                            <Input
                                id="jobTitle"
                                placeholder="Backend Engineer"
                                error={form.formState.errors.jobTitle?.message}
                                {...form.register("jobTitle")}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicationStatus" required>Status</Label>
                        <QuickStatusSelect
                            value={form.watch("applicationStatus")}
                            onChange={(status) => form.setValue("applicationStatus", status)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobURL">Job URL</Label>
                        <Input
                            id="jobURL"
                            type="url"
                            placeholder="https://..."
                            {...form.register("jobURL")}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="Remote, New York, etc." {...form.register("location")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appliedDate">Applied Date</Label>
                            <Input id="appliedDate" type="date" {...form.register("appliedDate")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="salaryMin">Min Salary</Label>
                            <Input id="salaryMin" type="number" placeholder="80000" {...form.register("salaryMin")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salaryMax">Max Salary</Label>
                            <Input id="salaryMax" type="number" placeholder="120000" {...form.register("salaryMax")} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Input id="source" placeholder="LinkedIn, Indeed, Referral..." {...form.register("source")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            rows={4}
                            placeholder="Any context, referrals, or interview details..."
                            {...form.register("notes")}
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
                                    <Input id="followUpDate" type="date" {...form.register("followUpDate")} />
                                    {form.watch("followUpDate") && (
                                        <button
                                            type="button"
                                            onClick={() => form.setValue("followUpDate", "")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="followUpNote">Note</Label>
                                <Input id="followUpNote" placeholder="Ask about timeline..." {...form.register("followUpNote")} />
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
        </motion.div>
    )
}
