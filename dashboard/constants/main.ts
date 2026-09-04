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
  UserRound,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export const roleDashboardPaths: Record<UserRole, string> = {
  ADMIN: "/admin",
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
    href: "/admin/executors",
    roles: ["ADMIN"],
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
