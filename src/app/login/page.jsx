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
        <div className="min-h-screen flex items-center justify-center -mt-16">
            <div className="w-3/4 max-w-xl rounded-lg shadow-md p-6">
                <h1 className="text-xl font-bold text-blue-900 mb-6 text-center font-mono">
                    Administrator Login
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-1 text-center">
                        <input
                            type="text"
                            placeholder="Admin Username"
                            value={username}
                            disabled={isSubmitting}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="
                        w-2/3 rounded-md border px-3 py-2
                        focus:outline-none focus:ring-1 focus:ring-blue-500
                        focus:border-blue-500 mb-4 font-mono
                        "
                        />
                    </div>
                    <div className="space-y-1 text-center">
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            disabled={isSubmitting}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="
                        w-2/3 rounded-md border px-3 py-2
                        focus:outline-none focus:ring-1 focus:ring-blue-500
                        focus:border-blue-500 mb-4 font-mono
                        "
                        />
                    </div>

                    <div className="text-center">

                        <button
                            type="submit"
                            onClick={() => redirect("/admin/applications")}
                            className="
                            rounded-md px-4 py-2 font-mono
                            font-medium text-center border-1
                            border-blue-900 text-blue-900
                        "
                        >
                            Log In
                        </button>
                    </div>


                </form>

            </div>
        </div>
    );
}
