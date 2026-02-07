import { getAllApplications } from "@/lib/applicationsRepo";
import ApplicationsClient from "@/components/ApplicationsClient";

export default async function ApplicationsPage() {
    const applications = await getAllApplications();

    return (
        <>
            <ApplicationsClient
                applications={applications}
                isAdmin={false}
            />
        </>
    )
}
