import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateApplication } from "@/features/applications/api/useApplications";
import type { ApplicationStatus } from "@/features/applications/api/useApplications";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import type { ApplicationFormValues } from "@/features/applications/components/ApplicationForm";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewApplicationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { mutateAsync: createApplication, isPending } = useCreateApplication();

    const defaultStatus = searchParams.get("status") as ApplicationStatus | null;

    const handleSubmit = async (data: ApplicationFormValues) => {
        const payload: Record<string, unknown> = {
            company: data.company,
            jobTitle: data.jobTitle,
            applicationStatus: data.applicationStatus,
            jobURL: data.jobURL || "",
            location: data.location || "",
            salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
            salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
            appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : null,
            notes: data.notes || "",
            followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : null,
            followUpNote: data.followUpNote || "",
            source: data.source || ""
        };

        await createApplication(payload);
        navigate("/app/applications");
    };

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                icon={Plus}
                title="New Application"
                description={`Add a new job application to track${defaultStatus ? ` (Status: ${defaultStatus.replace("_", " ")})` : ""}`}
                className="mb-6"
                actions={
                    <Link to="/app/applications">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                }
            />

            <ApplicationForm
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                defaultStatus={defaultStatus}
            />
        </PageContainer>
    );
}
