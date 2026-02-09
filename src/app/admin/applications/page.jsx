import ApplicationsClient from "@/components/ApplicationsClient";
import { getAllApplications } from "@/lib/applicationsRepo";

export default async function AdminApplicationPage() {
    const applications = await getAllApplications();

    return (
        <>
            <ApplicationsClient
                applications={applications}
                isAdmin={true}
            />
        </>
    )
}
