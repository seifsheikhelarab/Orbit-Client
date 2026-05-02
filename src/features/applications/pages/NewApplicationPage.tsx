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
            applicationStatus: data.applicationStatus
        };

        if (data.jobURL) payload.jobURL = data.jobURL;
        if (data.location) payload.location = data.location;
        if (data.salaryMin) payload.salaryMin = Number(data.salaryMin);
        if (data.salaryMax) payload.salaryMax = Number(data.salaryMax);
        if (data.appliedDate)
            payload.appliedDate = new Date(data.appliedDate).toISOString();
        if (data.notes) payload.notes = data.notes;

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
