import ApplicationsClient from "@/components/ApplicationsClient";
import { getAllApplications } from "@/lib/applicationsRepo";

export default async function AdminApplicationPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const pageSize = 3;

    const { data, pagination } = await getAllApplications({
        page: currentPage,
        limit: pageSize,
    });

    return (
        <>
            <ApplicationsClient
                applications={data}
                isAdmin={false}
                pagination={pagination}
            />
        </>
    )
}
