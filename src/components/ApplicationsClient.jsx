"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsFilters from "./ApplicationsFilters";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ApplicationsTableSkeleton from "./ApplicationsTableSkeleton";
import { ADMIN_HEADER_KEY, ADMIN_STORAGE_KEY } from "@/lib/authConstants";

export default function ApplicationsClient({ applications }) {
    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [arrangementFilter, setarrangementFilter] = useState("all");
    const [mounted, setMounted] = useState(false);
    const [applicationPendingDeletion, setApplicationPendingDeletion] = useState(null);
    const [isDeleteInProgress, setIsDeleteInProgress] = useState(false);

    const filteredApplications = applications.filter((app) => {
        const statusMatch = statusFilter === "all" || app.applicationStatus === statusFilter;
        const arrangementMatch = arrangementFilter === "all" || app.workArrangement === arrangementFilter;

        return statusMatch && arrangementMatch;
    })

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

    if (isLoading) {
        return <ApplicationsTableSkeleton />;
    }

    // async function handleDelete(applicationId) {


    //     const confirmed = window.confirm(
    //         "Are you sure you want to delete this application? This action cannot be undone."
    //     );
    //     if (!confirmed) return;

    //     await fetch(`/api/applications/${applicationId}`, {
    //         method: "DELETE",
    //         headers: {
    //             [ADMIN_HEADER_KEY]: localStorage.getItem(ADMIN_STORAGE_KEY),
    //         },
    //     });

    //     router.refresh();
    // }

    const handleDeleteRequest = (application) => {
        setApplicationPendingDeletion(application);
        console.log(application);
    }

    const handleDeleteConfirmation = async () => {
        if (!applicationPendingDeletion) return;

        const applicationId = applicationPendingDeletion._id;

        try {
            setIsDeleteInProgress(true);

            await fetch(`/api/applications/${applicationId}`, {
                method: "DELETE",
                headers: {
                    [ADMIN_HEADER_KEY]: localStorage.getItem(ADMIN_STORAGE_KEY),
                },
            });

            setApplicationPendingDeletion(null);

            router.refresh();
        } catch (error) {
            console.error("Failed to delete application", error);
        } finally {
            setIsDeleteInProgress(false);
        }
    };

    const handleDeleteCancellation = () => {
        setApplicationPendingDeletion(null);
    }

    function handleClearFilters() {
        setStatusFilter("all");
        setarrangementFilter("all");
    }

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

                <div>
                    <ApplicationsFilters
                        statusFilter={statusFilter}
                        arrangementFilter={arrangementFilter}
                        onStatusChange={setStatusFilter}
                        onArrangementChange={setarrangementFilter}
                    />
                </div>

                <div>
                    <ApplicationsTable
                        applications={filteredApplications}
                        totalCount={applications.length}
                        onClearFilters={handleClearFilters}
                        isAdmin={mounted && isAdmin}
                        onDelete={handleDeleteRequest}
                    />
                </div>
                <>
                    <ConfirmDeleteModal
                        open={Boolean(applicationPendingDeletion)}
                        title="Delete Application?"
                        description={
                            <>
                                This will permanently delete the application for {" "}
                                <span className="font-semibold text-black">
                                    {applicationPendingDeletion?.companyName}
                                </span>
                                <p className="mt-2 text-sm text-red-600">
                                    <span className="font-medium uppercase tracking-wide">
                                        Caution:
                                    </span>{" "}
                                    This action cannot be undone.
                                </p>
                            </>
                        }
                        isLoading={isDeleteInProgress}
                        onConfirm={handleDeleteConfirmation}
                        onCancel={handleDeleteCancellation}
                    />
                </>
            </div>
        </div>
    )
}