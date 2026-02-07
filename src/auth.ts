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
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials) {
                console.log("Credentials received: ", credentials);
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                // const client = await clientPromise;
                // const db = client.db();

                // const user = await db
                //     .collection("users")
                //     .findOne({ email: credentials.adminUserInput });



                if (credentials.username === process.env.ADMIN_USERNAME &&
                    credentials.password === process.env.ADMIN_PASSWORD
                ) {
                    return {
                        id: "admin",
                        name: "Admin",
                        username: process.env.ADMIN_USERNAME,
                        role: "admin",
                    };
                }

                return null;

                // if (typeof credentials.adminPasswordInput !== "string") {
                //     return null;
                // }

                // const isPasswordValid = await compare(
                //     credentials.adminPasswordInput,
                //     user.passwordHash
                // );

                // if (!isPasswordValid) {
                //     return null;
                // }

                // return {
                //     id: user._id.toString(),
                //     adminUserInput: user.adminUserInput,
                //     role: user.role,
                // } 
                // satisfies User & { role: "admin" | "user" };
            },
        }),
    ],

    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.username = (user as any).username;
            }
            return token;
        },

        async session ({ session, token }) {
            if (session.user){
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "user";
                session.user.username = token.username as string;
            }
            return session;
        },
    },
});
