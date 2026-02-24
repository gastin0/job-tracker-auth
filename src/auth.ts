import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "./models/User";
import bcrypt from "bcrypt";
import { connect } from "./lib/mongoose";

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
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials) {
                await connect();
                if (!credentials || typeof credentials.username !== "string" || typeof credentials.password !== "string") {
                    return null;
                }

                const user = await User.findOne({ username: credentials.username });

                if (!user) {
                    return null

                };

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    name: "Admin",
                    username: user.username,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "user";
                session.user.username = token.username as string;
            }
            return session;
        },
    },
});
