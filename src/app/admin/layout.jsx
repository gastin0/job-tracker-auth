import { auth } from "@/auth";
import { isAdminUser } from "@/lib/isAdminUser";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }) {
    const session = await auth();

    if (!session || !isAdminUser(session)) {
        redirect("/login");
    }
    return (
        <div>
            <AdminHeader />
            {children}
        </div>
    )
}