"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToast from "@/components/ui/NotificationToast";

export default function EditApplicationForm({ applicationId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [error, setError] = useState(null);

    const [applicationFormData, setApplicationFormData] = useState({
        companyName: "",
        jobTitle: "",
        workArrangement: "",
        applicationStatus: "",
        applicationDate: "",
        notes: "",
    });

    useEffect(() => {
        async function loadApplicationData() {
            try {
                setIsLoading(true);
                setError(null);

                console.log("Fetching application with ID: ", applicationId)

                const response = await fetch(`/api/applications/${applicationId}`);

                console.log("Response status: ", response.status)

                if (!response.ok) {
                    throw new Error("Failed to load application data");
                }

                const applicationData = await response.json();

                console.log("Application Data received:", applicationData)

                setApplicationFormData({
                    companyName: applicationData.companyName || "",
                    jobTitle: applicationData.jobTitle || "",
                    workArrangement: applicationData.workArrangement || "",
                    applicationStatus: applicationData.applicationStatus || "",
                    applicationDate: applicationData.applicationDate ? new Date(applicationData.applicationDate).toISOString().substring(0, 10) : "",
                    notes: applicationData.notes || "",
                });
            } catch (err) {
                console.error("Error loading application:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        if (applicationId) {
            loadApplicationData();
        }
    }, [applicationId]);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setApplicationFormData(previousState => ({
            ...previousState,
            [name]: value
        }));
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/applications/${applicationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(applicationFormData),
            });

            if (!response.ok) {
                alert("Failed to update application");
                return;
            }

            setToastVisible(true);

            setTimeout(() => {
                router.push("/admin/applications");
            }, 2000);
            router.refresh();
        } catch (err) {
            console.error("Error updating application:", err);
            alert("Failed to update application. Please try again");
        } finally {
            setIsSubmitting(false);
        }

    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Application</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/applications")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }



    return (
        <>
            <div>
                <NotificationToast
                    message="Data updated successfully"
                    isVisible={toastVisible}
                    onClose={() => setToastVisible(false)}
                    variant="success"
                />
            </div>

            <div className="min-h-screen flex items-start justify-center p-6">
                <div className="w-full max-w-xl bg-[rgb(var(--color-card))] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
                        Edit Job Application
                    </h1>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Company Name
                            </label>
                            <input
                                name="companyName"
                                value={applicationFormData.companyName}
                                onChange={handleInputChange}
                                placeholder="Company Name"
                                required
                                className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Job Title
                            </label>
                            <input
                                name="jobTitle"
                                value={applicationFormData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="Job Title"
                                required
                                className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Work Arrangement
                            </label>
                            <select
                                name="workArrangement"
                                value={applicationFormData.workArrangement}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                            >
                                <option value="">Work Arrangement</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="on-site">On-site</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Application Status
                            </label>
                            <select
                                name="applicationStatus"
                                value={applicationFormData.applicationStatus}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                            >
                                <option value="">Application Status</option>
                                <option value="applied">Applied</option>
                                <option value="in_progress">In Progress</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <label className="text-sm font-medium">
                            Application Date
                        </label>
                        <div className="space-y-1">
                            <input
                                type="date"
                                name="applicationDate"
                                value={applicationFormData.applicationDate}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                            />
                        </div>

                        <textarea
                            name="notes"
                            value={applicationFormData.notes}
                            onChange={handleInputChange}
                            placeholder="Notes (optional)"
                            rows={3}
                            className="w-full rounded-md border px-3 py-2 resize-none
                        focus:outline-none focus:ring-2 focus:ring-blue-600
                        focus:border-blue-600"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                        w-full mt-4
                        rounded-md bg-blue-600
                        px-4 py-2
                        font-medium text-white
                        hover:bg-blue-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                        "
                        >
                            {isSubmitting ? "Saving Changes..." : "Confirm Edit"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}