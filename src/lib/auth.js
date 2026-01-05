import { ADMIN_STORAGE_KEY } from "./authConstants";

export function isAdmin() {
    const secret = localStorage.getItem(ADMIN_STORAGE_KEY);
    return Boolean(secret);
}

export function logoutAdmin() {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
}