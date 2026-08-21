"use client";

import { Crown, Shield, ShieldCheck, UserCheck, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserWithDepartment } from "@/types/user";

export const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    cardClass: string;
    avatarClass: string;
    iconClass: string;
    icon: typeof Crown;
  }
> = {
  ADMIN: {
    label: "Администратор",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    cardClass:
      "border-purple-200/80 bg-gradient-to-br from-purple-50/40 via-white to-white",
    avatarClass: "border-purple-400 bg-purple-100 text-purple-900",
    iconClass: "text-purple-600",
    icon: ShieldCheck,
  },
  HEAD: {
    label: "Начальник отдела",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    cardClass:
      "border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-white",
    avatarClass: "border-amber-400 bg-amber-100 text-amber-900",
    iconClass: "text-amber-500",
    icon: Crown,
  },
  DEPUTY: {
    label: "Зам. начальника",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    cardClass:
      "border-blue-200/80 bg-gradient-to-br from-blue-50/40 via-white to-white",
    avatarClass: "border-blue-400 bg-blue-100 text-blue-900",
    iconClass: "text-blue-500",
    icon: Shield,
  },
  USER: {
    label: "Сотрудник",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
    cardClass: "border-zinc-200 bg-white",
    avatarClass: "border-zinc-200 bg-zinc-100 text-zinc-700",
    iconClass: "text-zinc-500",
    icon: UserCheck,
  },
};

interface EmployeeCardProps {
  user: UserWithDepartment;
  variant?: "featured" | "compact";
}

export function EmployeeCard({ user, variant = "compact" }: EmployeeCardProps) {
  const config = STATUS_CONFIG[user.status] || STATUS_CONFIG.USER;
  const StatusIcon = config.icon;

  const initials =
    ((user.username?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() ||
    "U";

  const fullName = user.last_name
    ? `${user.last_name} ${user.username}`
    : user.username;

  const departmentText = user.department_title || "Без отдела";

  if (variant === "featured") {
    return (
      <Card
        className={`shadow-xs hover:shadow-md transition-shadow ${config.cardClass}`}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar
            className={`h-12 w-12 border-2 font-semibold ${config.avatarClass}`}
          >
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 truncate">
                {fullName}
              </h3>
              <StatusIcon className={`h-4 w-4 shrink-0 ${config.iconClass}`} />
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
              <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{departmentText}</span>
            </div>

            <div className="mt-2">
              <Badge
                className={`text-[10px] font-medium border ${config.badgeClass}`}
              >
                {config.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 bg-white hover:border-zinc-300 transition-colors shadow-xs">
      <CardContent className="p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-zinc-900 truncate">
            {fullName}
          </h4>

          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1 min-w-0 truncate">
              <Building2 className="h-3 w-3 text-zinc-400 shrink-0" />
              <span className="truncate">{departmentText}</span>
            </span>

            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 shrink-0 ${config.badgeClass}`}
            >
              {config.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
