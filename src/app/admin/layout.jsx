export default function AdminLayout ({ children }) {
    return (
        <div>
            <div className="border-b p-4 text-sm text-gray-600">
                Admin Area
            </div>
            {children}
        </div>
    )
}