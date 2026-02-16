"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminHeader(){
    const { data: session, status} = useSession();
    let alternateName = session?.user.username === "admin" ? "Administrator" : null;

    if (status !== "authenticated") return null;

    return(
        <div className="flex justify-end items-center p-2 border-b px-5">
            <span>
                You are logged in as <strong>{alternateName}</strong>
            </span>
            <span className="mx-3">|</span>
            <button
                onClick={() => signOut({ callbackUrl: "/applications"})}
                className="px-3 border rounded bg-red-600 font-bold text-white"
            >
                Logout
            </button>
        </div>
    )
}