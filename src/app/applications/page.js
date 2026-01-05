import { headers } from "next/headers";

async function getApplications() {
    const res = await fetch(
        new URL("/api/applications", "http://localhost:3000"),
        { cache: "no-store"}
    );

    if (!res.ok) {
        throw new Error("Failed to fetch applications.");
    }

    return res.json();
}


export default async function ApplicationsPage() {
    const applications = await getApplications();

    return (
        <div>
            <h1>Job Application</h1>

            <ul>
                {applications.map((app) => (
                    <li key={app._id.toString()}>
                        {app.company} - {app.status} ({app.type})
                    </li>
                ))}
            </ul>
        </div>
    );
}