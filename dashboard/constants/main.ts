import {
  Building2,
  LayoutDashboard,
  type LucideIcon,
  Newspaper,
  Plane,
  Users,
  UserRound,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export const ADMIN_ACCESS_ROLES: UserRole[] = [
  "ADMIN",
  "DIVISION_HEAD",
  "MANAGEMENT_HEAD",
];

export const roleDashboardPaths: Record<UserRole, string> = {
  ADMIN: "/admin",
  DIVISION_HEAD: "/admin",
  MANAGEMENT_HEAD: "/admin",
  HEAD: "/heads",
  DEPUTY: "/heads",
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
    roles: ADMIN_ACCESS_ROLES,
    icon: LayoutDashboard,
  },
  {
    label: "Отделы",
    href: "/admin/departments",
    roles: ADMIN_ACCESS_ROLES,
    icon: Users,
  },
  {
    label: "Управления",
    href: "/admin/managements",
    roles: ["ADMIN", "DIVISION_HEAD", "MANAGEMENT_HEAD"],
    icon: Building2,
  },
  {
    label: "Задачи",
    href: "/admin/tasks",
    roles: ADMIN_ACCESS_ROLES,
    icon: Newspaper,
  },
  {
    label: "Сотрудники",
    href: "/admin/executors",
    roles: ADMIN_ACCESS_ROLES,
    icon: Plane,
  },
  {
    label: "Панель",
    href: "/heads",
    roles: ["HEAD"],
    icon: LayoutDashboard,
  },
  {
    label: "Задачи",
    href: "/heads/tasks",
    roles: ["HEAD"],
    icon: Newspaper,
  },
  {
    label: "Сотрудники",
    href: "/heads/executors",
    roles: ["HEAD"],
    icon: Plane,
  },
  {
    label: "Сотрудники моего отдела",
    href: "/heads/myexecutors",
    roles: ["HEAD"],
    icon: Plane,
  },

  {
    label: "Панель",
    href: "/heads",
    roles: ["DEPUTY"],
    icon: LayoutDashboard,
  },
  {
    label: "Задачи",
    href: "/heads/tasks",
    roles: ["DEPUTY"],
    icon: Newspaper,
  },
  {
    label: "Сотрудники",
    href: "/heads/executors",
    roles: ["DEPUTY"],
    icon: Plane,
  },
  {
    label: "Сотрудники моего отдела",
    href: "/heads/myexecutors",
    roles: ["DEPUTY"],
    icon: Plane,
  },

  {
    label: "Панель",
    href: "/users",
    roles: ["USER"],
    icon: LayoutDashboard,
  },
  {
    label: "Задачи",
    href: "/users/tasks",
    roles: ["USER"],
    icon: Newspaper,
  },
  {
    label: "Сотрудники",
    href: "/users/executors",
    roles: ["USER"],
    icon: UserRound,
  },
];
