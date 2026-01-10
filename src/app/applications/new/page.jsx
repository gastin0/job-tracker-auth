"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { useState } from "react";
import { ADMIN_STORAGE_KEY, ADMIN_HEADER_KEY } from "@/lib/authConstants";

export default function NewApplicationPage() {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [workArrangement, setWorkArrangement] = useState("");
    const [applicationStatus, setApplicationStatus] = useState("");
    const [applicationDate, setApplicationDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAdmin()) {
            router.replace("/applications");
        } else {
            setIsCheckingAuth(false);
        }
    }, [mounted, router]);

    async function handleSubmit(e) {
            e.preventDefault();
            setIsSubmitting(true);

            try {
                const res = await fetch("/api/applications", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        [ADMIN_HEADER_KEY]: localStorage.getItem(ADMIN_STORAGE_KEY)
                    },
                    body: JSON.stringify({
                        companyName,
                        jobTitle,
                        workArrangement,
                        applicationStatus,
                        applicationDate,
                        notes,
                    }),
                });
    
                if (!res.ok) {
                    alert("Unauthorized or failed!");
                    return;
                }
    
                alert("Application recorded successfully!");
    
                setCompanyName("");
                setJobTitle("");
                setWorkArrangement("");
                setApplicationStatus("");
                setApplicationDate("");
                setNotes("");
            } finally {
                setIsSubmitting(false);
            }

    }

    if (!mounted || isCheckingAuth) {
        return (
            <div>
                <h1>Checking Access....</h1>
                <p>Verifying administrator permission</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen flex items-start justify-center p-6">
            <div className="w-full max-w-xl bg-[rgb(var(--color-card))] rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
                    Add Job Application
                </h1>
            
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Company Name
                        </label>
                        <input
                            type="text" 
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
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
                            type="text"
                            placeholder="Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
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
                            value={workArrangement}
                            onChange={(e) => setWorkArrangement(e.target.value)}
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
                            value={applicationStatus}
                            onChange={(e) => setApplicationStatus(e.target.value)}
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
                            value={applicationDate}
                            onChange={(e) => setApplicationDate(e.target.value)}
                            required
                            className="w-full rounded-md border px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-600
                            focus:border-blue-600"
                        />
                    </div>

                    <textarea
                        placeholder="Notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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
                        {isSubmitting ? "Saving..." : "Save Application"}
                    </button>

                </form>
            </div>
        </div>
    );

}

