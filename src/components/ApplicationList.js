"use client";

import React, { useState } from "react";

export default function ApplicationForm() {
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [workArrangement, setWorkArrangement] = useState("");
    const [applicationStatus, setApplicationStatus] = useState("");
    const [applicationDate, setApplicationDate] = useState("");
    const [notes, setNotes] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/applications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
            alert("Failed to create application record!");
            return;
        }

        setCompanyName("");
        setJobTitle("");
        setWorkArrangement("");
        setApplicationStatus("");
        setApplicationDate("");
        setNotes("");

        alert("Application recorded successfully!");
    }

    return (
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
                value={setApplicationStatus}
                onChange={(e) => setApplicationStatus(e.target.value)}
                required
            >
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

            <button type="submit">Save Application</button>

        </form>
    )
}