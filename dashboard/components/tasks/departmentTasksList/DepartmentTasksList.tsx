"use client";

import { Building2, FileText } from "lucide-react";

import AllTasksList from "@/components/tasks/allTasksList/AllTasksList";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";

interface Props {
  user: UserType;
  scopeBasePath?: string;
}

export default function DepartmentTasksList({
  user,
  scopeBasePath = "/users/tasks",
}: Props) {
  if (!user.department_id) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Card className="border-dashed border-amber-300 bg-amber-50/50">
          <CardContent className="space-y-3 p-10 text-center">
            <Building2 className="mx-auto h-9 w-9 text-amber-600" />
            <h1 className="font-semibold text-zinc-900">Отдел не назначен</h1>
            <p className="text-sm text-zinc-600">
              Задачи отдела появятся после привязки вашего аккаунта к отделу.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AllTasksList
      user={user}
      departmentId={user.department_id}
      canCreate={true}
      taskBasePath={scopeBasePath}
      taskScope="department"
      scopeBasePath={scopeBasePath}
    />
  );
}

export function DepartmentTasksLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="h-8 w-56 animate-pulse rounded bg-zinc-200" />
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <FileText className="h-4 w-4" /> Загрузка задач отдела...
      </div>
    </div>
  );
}
