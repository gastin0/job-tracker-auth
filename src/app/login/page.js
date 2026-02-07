"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdmminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        await signIn("credentials", {
            username,
            password,
            redirect: true,
            callbackUrl: "/applications",
        });
    }

    return(
        <div>
            <h1>Administrator Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Admin Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Log In</button>
            </form>
        </div>
    );
}
