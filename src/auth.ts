import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import clientPromise from "./lib/mongodb";
import type { User } from "next-auth";

export const {
    auth,
    handlers,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const client = await clientPromise;
                const db = client.db();

                const user = await db
                    .collection("users")
                    .findOne({ email: credentials.email });

                if (!user) {
                    return null;
                }

                if (typeof credentials.password !== "string") {
                    return null;
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                } satisfies User & { role: "admin" | "user" };
            },
        }),
    ],

    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id,
                token.role = (user as any).role;
            }
            return token;
        },

        async session ({ session, token }) {
            if (session.user){
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "user";
            }
            return session;
        },
    },
});
