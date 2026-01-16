"use client";

import Link from "next/link";
import Image from "next/image";

export default function ApplicationsTable({ applications, isAdmin, onDelete }) {
    function formatStatus(value) {
        return value ? value.replace("_", " ").toUpperCase() : "";
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* <h1
                className="text-3xl font-semibold text-blue-900 text-center mb-6 tracking-tight"
            >
                Work Applications
            </h1>
            {isAdmin && (
                <Link
                    href={`/applications/new/`}
                    className="inline-block cursor-pointer hover:bg-blue-800 bg-blue-900 text-white px-10 py-2 rounded font-medium font-bold mb-2"
                >
                    Add Data
                </Link>
            )} */}
            

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-800 border-b text-slate-200">
                            <th className="px-4 py-3 text-left font-medium">Company</th>
                            <th className="px-4 py-3 text-left font-medium">Job Title</th>
                            <th className="px-4 py-3 text-left font-medium">Work Arrangement</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Applied Date</th>
                            {isAdmin &&
                                <td className="px-4 py-3 text-left font-medium">Actions</td>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application._id} className="border-b border-slate-700 hover:bg-slate-600/60">
                                <td className="px-4 py-3 text-slate-900 font-bold">{application.companyName}</td>
                                <td className="px-4 py-3 text-slate-900">{application.jobTitle}</td>
                                <td className="px-4 py-3 text-slate-900 capitalize">{application.workArrangement}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-medium w-full
                                        ${application.applicationStatus === "applied"
                                                ? "bg-blue-900 text-blue-200"
                                                : application.applicationStatus === "in_progress"
                                                    ? "bg-yellow-900 text-yellow-200"
                                                    : "bg-red-900 text-red-200"
                                            }`}
                                    >{formatStatus(application.applicationStatus)}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-900">
                                    {new Date(application.applicationDate).toLocaleDateString("en-CA")}
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-4 flex gap-3">
                                        <Link
                                            href={`applications/edit/${application._id}`}
                                            className="relative group cursor-pointer hover:opacity-80 px-3">
                                            <Image src="/icons/edit.svg" alt="Edit" width={16} height={16}></Image>
                                            <span className="
                                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap
                                                rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100
                                                transition pointer-events-none shadow-md
                                            ">
                                                Edit
                                            </span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(application._id)}
                                            className="relative group cursor-pointer hover:opacity-80"
                                        >
                                            <Image src="/icons/delete.svg" alt="Delete" width={16} height={16}></Image>
                                            <span className="
                                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap
                                                rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100
                                                transition pointer-events-none shadow-md
                                            ">
                                                Delete
                                            </span>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}