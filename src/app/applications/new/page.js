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
        <div>
            <h1>Add Job Application</h1>

            <form onSubmit={handleSubmit}>
                <h2>Add Job Application</h2>

                <input
                    type="text" 
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />

                <input 
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                />

                <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value)}
                    required
                >
                    <option value="">Work Arrangement</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                </select>

                <select
                    value={applicationStatus}
                    onChange={(e) => setApplicationStatus(e.target.value)}
                    required
                >
                    <option value="">Application Status</option>
                    <option value="applied">Applied</option>
                    <option value="in_progress">In Progresss</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Application"}
                </button>

            </form>

        </div>
    );

}

