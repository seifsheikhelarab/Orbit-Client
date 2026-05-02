import { useState } from "react"
import { format } from "date-fns"
import { CalendarPlus, Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

export interface InterviewRound {
    id: string
    applicationId: string
    roundType: "PHONE_SCREEN" | "TECHNICAL" | "SYSTEM_DESIGN" | "BEHAVIORAL" | "FINAL" | "OTHER"
    scheduledAt: string | null
    interviewerName: string | null
    notes: string | null
    outcome: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null
}

interface InterviewRoundsListProps {
    rounds: InterviewRound[]
    isLoading?: boolean
    companyName: string
    jobTitle: string
    onAdd: (data: Omit<InterviewRound, "id" | "applicationId">) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

const ROUND_TYPES = [
    { value: "PHONE_SCREEN", label: "Phone Screen" },
    { value: "TECHNICAL", label: "Technical" },
    { value: "SYSTEM_DESIGN", label: "System Design" },
    { value: "BEHAVIORAL", label: "Behavioral" },
    { value: "FINAL", label: "Final Round" },
    { value: "OTHER", label: "Other" }
]

const OUTCOMES = [
    { value: "POSITIVE", label: "Positive", color: "text-tertiary" },
    { value: "NEUTRAL", label: "Neutral", color: "text-amber-500" },
    { value: "NEGATIVE", label: "Negative", color: "text-error" }
]

export function InterviewRoundsList({
    rounds,
    isLoading,
    companyName,
    jobTitle,
    onAdd,
    onDelete
}: InterviewRoundsListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [roundType, setRoundType] = useState("PHONE_SCREEN")
    const [scheduledAt, setScheduledAt] = useState("")
    const [interviewerName, setInterviewerName] = useState("")
    const [notes, setNotes] = useState("")
    const [outcome, setOutcome] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setRoundType("PHONE_SCREEN")
        setScheduledAt("")
        setInterviewerName("")
        setNotes("")
        setOutcome("")
    }

    const handleAdd = async () => {
        setIsSubmitting(true)
        try {
            await onAdd({
                roundType: roundType as InterviewRound["roundType"],
                scheduledAt: scheduledAt || null,
                interviewerName: interviewerName || null,
                notes: notes || null,
                outcome: outcome as InterviewRound["outcome"]
            })
            setIsAddOpen(false)
            resetForm()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (roundId: string) => {
        if (!window.confirm("Are you sure you want to delete this interview round?")) return
        await onDelete(roundId)
    }

    const handleAddToCalendar = (round: InterviewRound) => {
        const roundTypeLabel = ROUND_TYPES.find(r => r.value === round.roundType)?.label || "Interview"
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${roundTypeLabel} - ${companyName} - ${jobTitle}`)}&dates=${round.scheduledAt ? new Date(round.scheduledAt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : ""}&details=${encodeURIComponent(round.notes || "")}`
        window.open(url, "_blank")
    }

    if (isLoading) {
        return <Skeleton className="h-20 w-full" />
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-outline pb-3">
                <div className="p-2 rounded-lg bg-tertiary-container">
                    <Calendar className="w-4 h-4 text-on-tertiary-container" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Interview Rounds</h2>
                <div className="flex-1" />
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <CalendarPlus className="w-4 h-4 mr-2" />
                            Log Interview
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log Interview Round</DialogTitle>
                            <DialogDescription>Record details about an interview round</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Round Type *</Label>
                                <Select value={roundType} onValueChange={setRoundType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ROUND_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Interviewer Name</Label>
                                <Input value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Notes</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-xl border border-outline bg-surface-container-low px-3 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/30"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Notes about the interview..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Outcome</Label>
                                <Select value={outcome} onValueChange={setOutcome}>
                                    <SelectTrigger><SelectValue placeholder="Pending" /></SelectTrigger>
                                    <SelectContent>
                                        {OUTCOMES.map((o) => (
                                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Log Interview"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {rounds && rounds.length > 0 ? (
                <div className="grid gap-3">
                    {rounds.map((round) => (
                        <div key={round.id} className="flex items-center justify-between p-4 rounded-xl border border-outline bg-surface">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-on-tertiary-container" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{ROUND_TYPES.find(r => r.value === round.roundType)?.label}</p>
                                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                        {round.scheduledAt && <span>{format(new Date(round.scheduledAt), "MMM d, yyyy")}</span>}
                                        {round.interviewerName && <span>· {round.interviewerName}</span>}
                                    </div>
                                    {round.outcome && (
                                        <div className={cn("text-xs font-medium mt-1", OUTCOMES.find(o => o.value === round.outcome)?.color)}>
                                            {OUTCOMES.find(o => o.value === round.outcome)?.label}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {round.scheduledAt && (
                                    <Button variant="ghost" size="icon" onClick={() => handleAddToCalendar(round)} title="Add to Google Calendar">
                                        <CalendarPlus className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(round.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-outline rounded-xl">
                    <CalendarPlus className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant">No interview rounds logged yet</p>
                </div>
            )}
        </div>
    )
}
