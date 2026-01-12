import Link from "next/link";
import Image from "next/image";

export default function ApplicationsTable({ applications, isAdmin}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2 text-left">Company</th>
                        <th className="px-4 py-2 text-left">Job Title</th>
                        <th className="px-4 py-2 text-left">Arrangement</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        {
                            isAdmin && (
                                <th className="px-4 py-2 text-left">Actions</th>
                            )
                        }
                    </tr>
                </thead>

                <tbody>
                    {applications.map(applcation => (
                        <tr key={applcation._id} className="border-b hover:bg-slate-600">
                            <td className="px-4 py-2">{application.companyName}</td>
                            <td className="px-4 py-2">{application.jobTitle}</td>
                            <td className="px-4 py-2">{application.workArrangement}</td>
                            <td className="px-4 py-2">{application.applicationStatus?.toUpperCase()}</td>
                            <td className="px-4 py-2">{application.applcationDate}</td>
                            {isAdmin && (
                                <td className="px-4 py-2 flex gap-3">
                                    <Link 
                                    href={`applications/edit/${applcation._id}`}
                                    className="hover:opcaity-80">
                                        <Image src="/icons/edit.svg" alt="Edit" width={16} height={16}></Image>
                                    </Link>
                                    <button
                                    type="button"
                                    onClick={() => onDelete(applcation._id)}
                                    className="hover:opacity-80"
                                    >
                                        <Image src="/icons/delete.svg" alt="Delete" width={16} height={16}></Image>
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}