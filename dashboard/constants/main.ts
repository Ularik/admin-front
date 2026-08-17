import type { UserRole } from "@/types/user";

export const roleDashboardPaths: Record<UserRole, string> = {
    ADMIN: "/admin",
    HEAD: "/heads",
    USER: "/users"
};