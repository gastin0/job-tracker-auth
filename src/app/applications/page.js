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

function upperCase(value) {
    return value ? value.toUpperCase() : "";
}


export default async function ApplicationsPage() {
    const applications = await getApplications();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="overflow-x-auto">
                {applications.length === 0 && (
                    <div className="text-slate-400 text-sm">
                        No applications found.
                    </div>
                )}
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-800 border-b text-slate-200">
                            <th className="px-4 py-3 text-left font-medium">Company</th>
                            <th className="px-4 py-3 text-left font-medium">Job Title</th>
                            <th className="px-4 py-3 text-left font-medium">Work Arrangement</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id} className="border-b border-slate-700 hover:bg-slate-600/60">
                                <td className="px-4 py-3 text-slate-900 font-bold">{app.companyName}</td>
                                <td className="px-4 py-3 text-slate-900">{app.jobTitle}</td>
                                <td className="px-4 py-3 text-slate-900 capitalize">{app.workArrangement}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-medium w-full
                                        ${
                                            app.applicationStatus === "applied"
                                            ? "bg-blue-900 text-blue-200"
                                            : app.applicationStatus === "in_progress"
                                            ? "bg-yellow-900 text-yellow-200"
                                            : "bg-red-900 text-red-200"
                                        }`}
                                    >{upperCase(app.applicationStatus.replace("_", " "))}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-900">
                                    {new Date(app.applicationDate).toISOString().split("T")[0]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}