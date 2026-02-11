import ApplicationsClient from "@/components/ApplicationsClient";
import { getAllApplications } from "@/lib/applicationsRepo";

export default async function AdminApplicationPage({ searchParams }) {
    const currentPage = Number(searchParams.page) || 1;
    const pageSize = 10;

    const { data, pagination } = await getAllApplications({
        page: currentPage,
        limit: pageSize,
    });

    return (
        <>
            <ApplicationsClient
                applications={data}
                isAdmin={true}
                pagination={pagination}
            />
        </>
    )
}
