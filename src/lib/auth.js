export function isAdmin() {
    if (typeof window == "undefined") {
        return false;
    }

    const secret = localStorage.getItem("admin_secret");
    return secret === process.env.NEXT_ADMIN_SECRET;
}