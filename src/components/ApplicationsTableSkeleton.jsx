export default function ApplicationsTableSkeleton() {
    return (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-slate-800 border-b text-slate-200">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <th key={i} className="">
                                <div className="h-4 w-24 rounded bg-gray-200"></div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: 5 }).map((_, row) => (
                        <tr key={row} className="border-t">
                            {Array.from({ length: 5 }).map((_, col) => (
                                <td key={col} className="px-4 pt-3">
                                    <div className="h-4 w-full rounded bg-gray-200"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}