"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsTableSkeleton from "./ApplicationsTableSkeleton";
import { ADMIN_HEADER_KEY, ADMIN_STORAGE_KEY } from "@/lib/authConstants";

export default function ApplicationsClient({ applications }) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [arrangementFilter, setarrangementFilter] = useState("all");
    const [mounted, setMounted] = useState(false);

    const filteredApplications = applications.filter((app) => {
        const statusMatch = statusFilter === "all" || app.applicationStatus === statusFilter;
        const arrangementMatch = arrangementFilter === "all" || app.workArrangement === arrangementFilter;

        return statusMatch && arrangementMatch;
    })

    // const filteredApplications = statusFilter === "all"
    //     ? applications
    //     : applications.filter((app) => app.applicationStatus === statusFilter);

    useEffect(() => {
        setMounted(true);

        const adminSecret = localStorage.getItem(ADMIN_STORAGE_KEY);
        setIsAdmin(Boolean(adminSecret));
    }, []);

    // // To set Timeout for testing the skeleton
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 2000);

    //     return () => clearTimeout(timer);
    // }, []);

    useEffect(() => {
        if (applications) {
            setIsLoading(false);
        }
    }, [applications]);

    async function handleDelete(applicationId) {


        const confirmed = window.confirm(
            "Are you sure you want to delete this application? This action cannot be undone."
        );
        if (!confirmed) return;

        await fetch(`/api/applications/${applicationId}`, {
            method: "DELETE",
            headers: {
                [ADMIN_HEADER_KEY]: localStorage.getItem(ADMIN_STORAGE_KEY),
            },
        });

        router.refresh();
    }

    if (isLoading) {
        return <ApplicationsTableSkeleton />;
    }

    // if (!filteredApplications || filteredApplications.length === 0) {
    //     return (
    //         <div className="mt-12 text-center text-gray-500">
    //             <h2 className="text-lg font-semibold text-gray-700">No Applications yet</h2>
    //             <p className="mt-2">Job application you add will appear here</p>

    //             {mounted && isAdmin && (
    //                 <a
    //                     href="/applications/new"
    //                     className="inline-block mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    //                 >
    //                     Add your first applications
    //                 </a>
    //             )}
    //         </div>
    //     );
    // }

    return (
        <div className="bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6 mt-6">
                    <h1 className="text-3xl font-semibold text-blue-900 tracking-tight">
                        Work Applications
                    </h1>

                    {mounted && isAdmin && (
                        <Link
                            href="/applications/new"
                            className="inline-flex items-center bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-medium text-sm"
                        >
                            Add Data
                        </Link>
                    )}
                </div>
                <div className="mb=2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="arrangementFilter"
                            className="text-sm font-medium text-gray-700"
                        >
                            Arrangement:
                        </label>
                        <select
                            id="arrangementFilter"
                            value={arrangementFilter}
                            onChange={(e) => setarrangementFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="on-site">On-site</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="statusFilter"
                            className="text-sm font-medium text-gray-700"
                        >
                            Status:
                        </label>

                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="applied">Applied</option>
                            <option value="in_progress">In progress</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <ApplicationsTable
                    applications={filteredApplications}
                    totalCount={applications.length}
                    isAdmin={mounted && isAdmin}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}