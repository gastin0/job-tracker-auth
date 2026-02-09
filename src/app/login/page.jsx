"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function AdmminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/admin/applications");
        } else {
            setErrorMessage("Invalid username or password");
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Administrator Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Admin Username"
                    value={username}
                    disabled={isSubmitting}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    disabled={isSubmitting}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    onClick={() => redirect("/admin/applications")}
                >
                    Log In
                </button>

            
            </form>
        </div>
    );
}
