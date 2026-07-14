import { useState, useEffect } from "react";
import { useCurrentUser, useUpdateUser, useChangePassword, useDeleteAccount } from "../api/useSettings";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageContainer, PageHeader } from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User, Bell, Shield, AlertTriangle, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Australia/Sydney",
];

export function SettingsPage() {
    const { data: user, isLoading } = useCurrentUser();
    const updateUser = useUpdateUser();
    const changePassword = useChangePassword();
    const deleteAccount = useDeleteAccount();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        timezone: "UTC",
        emailReminders: true,
        inAppNotifications: true,
    });

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteEmailConfirm, setDeleteEmailConfirm] = useState("");

    useEffect(() => {
        if (user?.data) {
            const userData = user.data;
            setTimeout(() => {
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    timezone: userData.timezone || "UTC",
                    emailReminders: userData.emailRemindersEnabled ?? true,
                    inAppNotifications: userData.inAppNotificationsEnabled ?? true,
                });
            }, 0);
        }
    }, [user]);

    if (isLoading) {
return (
        <PageContainer maxWidth="xl">
            <PageHeader
                icon={Settings}
                title="Settings"
                description="Manage your account preferences and security."
            />
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>
        </PageContainer>
    );
}

    const handleSave = async () => {
        try {
            await updateUser.mutateAsync({
                name: formData.name,
                email: formData.email,
                timezone: formData.timezone,
                emailRemindersEnabled: formData.emailReminders,
                inAppNotificationsEnabled: formData.inAppNotifications,
            });
            toast.success("Settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) return;
        try {
            await changePassword.mutateAsync({
                currentPassword: passwords.current,
                newPassword: passwords.new,
            });
            toast.success("Password updated successfully");
            setShowPasswordChange(false);
            setPasswords({ current: "", new: "", confirm: "" });
        } catch {
            toast.error("Failed to update password");
        }
    };

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                icon={Settings}
                title="Settings"
                description="Manage your account preferences and security."
            />

                <div className="space-y-8">
                    {/* Profile Card */}
                    <Card className="border border-outline shadow-sm overflow-hidden">
                        <CardHeader className="bg-surface-container border-b border-outline-variant p-6 flex flex-row items-center gap-4">
                            <div className="p-2.5 bg-primary text-on-primary rounded-lg shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription className="text-xs font-medium text-on-surface-variant">Personal identity and account info</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Full Name</Label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Email Address</Label>
                                    <Input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <Button 
                                onClick={handleSave} 
                                disabled={updateUser.isPending}
                            >
                                {updateUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Update Profile
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card className="border border-outline shadow-sm overflow-hidden">
                        <CardHeader className="bg-surface-container border-b border-outline-variant p-6 flex flex-row items-center gap-4">
                            <div className="p-2.5 bg-primary text-on-primary rounded-lg shrink-0">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription className="text-xs font-medium text-on-surface-variant">Regional and notification settings</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-2 max-w-sm">
                                <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Timezone</Label>
                                <Select 
                                    value={formData.timezone}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, timezone: val }))}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map(tz => (
                                            <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-surface-container border border-outline-variant rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">Email Reminders</p>
                                        <p className="text-xs text-on-surface-variant">Get notified about upcoming interviews via email</p>
                                    </div>
                                    <Switch 
                                        checked={formData.emailReminders}
                                        onCheckedChange={(val) => setFormData(prev => ({ ...prev, emailReminders: val }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-surface-container border border-outline-variant rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">In-App Notifications</p>
                                        <p className="text-xs text-on-surface-variant">Real-time alerts while using Orbit</p>
                                    </div>
                                    <Switch 
                                        checked={formData.inAppNotifications}
                                        onCheckedChange={(val) => setFormData(prev => ({ ...prev, inAppNotifications: val }))}
                                    />
                                </div>
                            </div>
                            <Button 
                                onClick={handleSave} 
                                disabled={updateUser.isPending}
                            >
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className="border border-outline shadow-sm overflow-hidden">
                        <CardHeader className="bg-surface-container border-b border-outline-variant p-6 flex flex-row items-center gap-4">
                            <div className="p-2.5 bg-primary text-on-primary rounded-lg shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Security</CardTitle>
                                <CardDescription className="text-xs font-medium text-on-surface-variant">Password and access management</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {!showPasswordChange ? (
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowPasswordChange(true)}
                                >
                                    Change Password
                                </Button>
                            ) : (
                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Current Password</Label>
                                        <Input 
                                            type="password" 
                                            value={passwords.current}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-on-surface-variant">New Password</Label>
                                        <Input 
                                            type="password" 
                                            value={passwords.new}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Confirm New Password</Label>
                                        <Input 
                                            type="password" 
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={handlePasswordChange}
                                            disabled={changePassword.isPending || passwords.new !== passwords.confirm}
                                        >
                                            Update Password
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setShowPasswordChange(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border border-error/30 shadow-sm overflow-hidden">
                        <CardHeader className="bg-error-container border-b border-error/20 p-6 flex flex-row items-center gap-4">
                            <div className="p-2.5 bg-error text-on-error rounded-lg shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-error">Danger Zone</CardTitle>
                                <CardDescription className="text-xs font-medium text-error/80">Permanent account actions</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {!showDeleteConfirm ? (
                                <Button 
                                    variant="destructive" 
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Account
                                </Button>
                            ) : (
                                <div className="space-y-4 max-w-md">
                                    <p className="text-sm text-error font-medium">
                                        This action cannot be undone. All your applications, resumes, and documents will be permanently deleted.
                                    </p>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-on-surface-variant">Type your email to confirm</Label>
                                        <Input 
                                            placeholder={user?.data?.email}
                                            value={deleteEmailConfirm}
                                            onChange={(e) => setDeleteEmailConfirm(e.target.value)}
                                            className="h-11 focus:border-error"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="destructive" 
                                            disabled={deleteAccount.isPending || deleteEmailConfirm !== user?.data?.email}
                                            onClick={() => {
                                                deleteAccount.mutateAsync()
                                                    .then(() => {
                                                        toast.success("Account deleted");
                                                        signOut();
                                                    })
                                                    .catch(() => {
                                                        toast.error("Failed to delete account");
                                                    });
                                            }}
                                        >
                                            Confirm Permanent Deletion
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeleteEmailConfirm("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Logout */}
                    <Button 
                        variant="outline"
                        onClick={() => signOut()}
                        className="h-12 px-6 font-bold border-outline text-on-surface-variant hover:text-error hover:bg-error-container hover:border-error/30 w-full justify-start gap-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
        </PageContainer>
    );
}