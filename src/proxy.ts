import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
    const pathname = req.nextUrl.pathname;

    const isAdminRoute =
        pathname.startsWith("/admin");

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    const session = req.auth;

    if (!session || session.user?.role !== "admin") {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/applications";
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*"
    ],
};
