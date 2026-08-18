import {
  FileUser,
  CircleUser,
  FolderOpen,
  LayoutDashboard,
  type LucideIcon,
  Newspaper,
  Plane,
  Star,
  Tags,
  Users,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export const roleDashboardPaths: Record<UserRole, string> = {
  ADMIN: "/admin",
  HEAD: "/heads",
  USER: "/users",
};

export type DashboardMenuItem = {
  label: string;
  href: string;
  roles: UserRole[];
  icon: LucideIcon;
};

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    label: "Панель",
    href: "/admin",
    roles: ["ADMIN"],
    icon: LayoutDashboard,
  },
  {
    label: "Отделы",
    href: "/admin/departments",
    roles: ["ADMIN"],
    icon: Users,
  },
  {
    label: "Задачи",
    href: "/admin/tasks",
    roles: ["ADMIN"],
    icon: Newspaper,
  },
  {
    label: "Начальники отделов",
    href: "/admin/heads",
    roles: ["ADMIN"],
    icon: Plane,
  },
];
