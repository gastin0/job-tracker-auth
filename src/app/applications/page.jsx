import ApplicationsClient from "@/components/ApplicationsClient";

export default async function ApplicationPage() {
    const res = await fetch("http://localhost:3000/api/applications", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch applications.");
    }

    const applications = await res.json();

    return (
        <>
            < ApplicationsClient applications={applications} />
        </>
    )
}
