"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsFilters from "./ApplicationsFilters";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ApplicationsTableSkeleton from "./ApplicationsTableSkeleton";

export default function ApplicationsClient({ applications, isAdmin }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [arrangementFilter, setarrangementFilter] = useState("all");
    const [applicationPendingDeletion, setApplicationPendingDeletion] = useState(null);
    const [deleteState, setDeleteState] = useState("idle");     // "idle" || "loading" || "success"

    const deleteTriggerRef = useRef(null);

    const filteredApplications = applications.filter((app) => {
        const statusMatch = statusFilter === "all" || app.applicationStatus === statusFilter;
        const arrangementMatch = arrangementFilter === "all" || app.workArrangement === arrangementFilter;

        return statusMatch && arrangementMatch;
    })

    // // To set Timeout for testing the skeleton
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 2000);

    //     return () => clearTimeout(timer);
    // }, []);

    useEffect(() => {
        if (applications) {
            setIsLoading(false); // eslint-disable-line
        }
    }, [applications]);

    if (isLoading) {
        return <ApplicationsTableSkeleton />;
    }

    const handleDeleteRequest = (application) => {
        deleteTriggerRef.current = document.activeElement;
        setDeleteState("idle");
        setApplicationPendingDeletion(application);
    }

    const handleDeleteConfirmation = async () => {
        if (!applicationPendingDeletion) return;

        const applicationId = applicationPendingDeletion._id;

        try {
            setDeleteState("loading");

            await fetch(`/api/applications/${applicationId}`, {
                method: "DELETE",
            });

            await new Promise(r => setTimeout(r, 1200));

            setDeleteState("success");

            setTimeout(() => {
                setApplicationPendingDeletion(null);
                setDeleteState("idle");

                requestAnimationFrame(() => {
                    if (deleteTriggerRef.current?.isConnected) {
                        deleteTriggerRef.current.focus();
                    } else {
                        deleteTriggerRef.current = null;
                    }
                })

                router.refresh();
            }, 1200);

        } catch (error) {
            console.error("Failed to delete application", error);
            setDeleteState("confirm");
        }
    };

    const handleDeleteCancellation = () => {
        if (deleteState === "loading") return;

        setApplicationPendingDeletion(null);
        setDeleteState("idle");

        requestAnimationFrame(() => {
            deleteTriggerRef.current?.focus();
            deleteTriggerRef.current = null;
        });
    };

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

                    {isAdmin && (
                        <Link
                            href="/admin/applications/new"
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
                        isAdmin={isAdmin}
                        onDelete={handleDeleteRequest}
                    />
                </div>
                <>
                    <ConfirmDeleteModal
                        open={Boolean(applicationPendingDeletion)}
                        state={deleteState}
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
                        isLoading={deleteState === "loading"}
                        onConfirm={handleDeleteConfirmation}
                        onCancel={handleDeleteCancellation}
                    />
                </>
            </div>
        </div>
    )
}