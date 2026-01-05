"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_STORAGE_KEY } from "@/lib/authConstants";

export default function AdmminLoginPage() {
    const router = useRouter();
    const [adminKeyInput, setAdminKeyInput] = useState("");
    const [authErrorMessage, setAuthErrorMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (adminKeyInput === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
            localStorage.setItem(ADMIN_STORAGE_KEY, adminKeyInput);
            router.push("/applications/new");
        } else {
            setAuthErrorMessage("Invalid Administrator Credentials.");
        }
    }

    return(
        <div>
            <h1>Administrator Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Administrator Key"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    required
                />

                <button type="submit">Log In</button>
            </form>

            {authErrorMessage && <p>{authErrorMessage}</p>}
        </div>
    );
}
