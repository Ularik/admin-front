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
  DEPUTY: "/heads",
  USER: "/employers",
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
    label: "Сотрудники",
    href: "/admin/employers",
    roles: ["ADMIN"],
    icon: Plane,
  },
    {
    label: "Задачи",
    href: "/heads/tasks",
    roles: ["HEAD"],
    icon: Newspaper,
  },
];
