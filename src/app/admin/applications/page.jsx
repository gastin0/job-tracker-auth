import { auth } from "@/auth";
import ApplicationsClient from "@/components/ApplicationsClient";
import { getAllApplications } from "@/lib/applicationsRepo";
import { redirect } from "next/navigation";

export default async function AdminApplicationPage() {
    const session = await auth();

    if (!session || session?.user?.role !== "admin") {
        redirect("/applications");
    }

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
