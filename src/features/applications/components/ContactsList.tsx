import { useState } from "react"
import { UserPlus, Trash2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui"
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

export interface Contact {
    id: string
    applicationId: string
    name: string
    title: string | null
    email: string | null
    phone: string | null
    linkedinUrl: string | null
}

interface ContactsListProps {
    contacts: Contact[]
    isLoading?: boolean
    onAdd: (data: Omit<Contact, "id" | "applicationId">) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function ContactsList({ contacts, isLoading, onAdd, onDelete }: ContactsListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [name, setName] = useState("")
    const [title, setTitle] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [linkedinUrl, setLinkedinUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setName("")
        setTitle("")
        setEmail("")
        setPhone("")
        setLinkedinUrl("")
    }

    const handleAdd = async () => {
        if (!name.trim()) return
        setIsSubmitting(true)
        try {
            await onAdd({ name, title: title || null, email: email || null, phone: phone || null, linkedinUrl: linkedinUrl || null })
            setIsAddOpen(false)
            resetForm()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (contactId: string) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return
        await onDelete(contactId)
    }

    if (isLoading) {
        return <Skeleton className="h-20 w-full" />
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-outline pb-3">
                <div className="p-2 rounded-lg bg-secondary-container">
                    <UserPlus className="w-4 h-4 text-on-secondary-container" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Contacts</h2>
                <div className="flex-1" />
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Contact</DialogTitle>
                            <DialogDescription>
                                Add a contact for this application (recruiter, hiring manager, etc.)
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Recruiter" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input id="linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={!name.trim() || isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Contact"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {contacts && contacts.length > 0 ? (
                <div className="grid gap-3">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 rounded-xl border border-outline bg-surface">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                                    <span className="text-sm font-medium text-on-primary-fixed">{contact.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{contact.name}</p>
                                    {contact.title && <p className="text-xs text-on-surface-variant">{contact.title}</p>}
                                    <div className="flex items-center gap-2 mt-1">
                                        {contact.email && (
                                            <a href={`mailto:${contact.email}`} className="text-xs text-on-surface-variant hover:text-primary">
                                                <Mail className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-outline rounded-xl">
                    <UserPlus className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant">No contacts added yet</p>
                </div>
            )}
        </div>
    )
}
