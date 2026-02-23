"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsFilters from "./ApplicationsFilters";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ApplicationsTableSkeleton from "./ApplicationsTableSkeleton";

export default function ApplicationsClient({ applications, isAdmin, pagination, currentFilters }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [applicationPendingDeletion, setApplicationPendingDeletion] = useState(null);
    const [deleteState, setDeleteState] = useState("idle");     // "idle" || "loading" || "success"

    const statusFilter = searchParams.get("status") || "all";
    const arrangementFilter = searchParams.get("arrangement") || "all";

    const deleteTriggerRef = useRef(null);

    const updateQueryParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            params.set(key, value);
        });

        router.push(`${pathname}?${params.toString()}`);
    };

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
        router.push(pathname);
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
                        onStatusChange={(value) => 
                            updateQueryParams({
                                status: value,
                                page: 1,
                            })
                        }
                        onArrangementChange={(value) =>
                            updateQueryParams({
                                arrangement: value,
                                page: 1,
                            })
                        }
                    />
                </div>

                <div>
                    <ApplicationsTable
                        applications={applications}
                        totalCount={applications.length}
                        onClearFilters={handleClearFilters}
                        isAdmin={isAdmin}
                        isFiltered={statusFilter !== "all" || arrangementFilter !== "all"}
                        onDelete={handleDeleteRequest}
                    />
                </div>
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() =>
                                updateQueryParams({ page: pagination.currentPage - 1 })
                            }
                            className="
                                px-4 py-1 border rounded-md font-medium
                                border border-blue-900 text-blue-900
                                hover:bg-blue-50 transition-colors
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover-bg-transparent
                                "
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() =>
                                updateQueryParams({ page: pagination.currentPage + 1 })
                            }
                            className="
                                px-4 py-1 border rounded-md font-medium
                                border border-blue-900 text-blue-900
                                hover:bg-blue-50 transition-colors
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover-bg-transparent
                                "
                        >
                            Next
                        </button>
                    </div>
                )}
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