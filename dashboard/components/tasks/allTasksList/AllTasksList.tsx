"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/services/queries/departments";
import type { TaskType } from "@/types/tasks";
import { useTasks } from "@/services/queries/tasks";
import { PaginationControl } from "@/components/pagination/pagination";
import TasksDepartments from "@/components/tasks/tasksDepartments";
import TaskScopeToggle from "@/components/tasks/taskScopeToggle/TaskScopeToggle";
import { UserType } from "@/types/user";

interface Props {
    user: UserType;
    departmentId?: string;
    canCreate?: boolean;
    taskBasePath?: string;
    taskScope?: "all" | "department";
}

export default function AllTasksList({
  user,
  departmentId,
  canCreate = user.status === "ADMIN" || Boolean(user.department_id),
  taskBasePath = "tasks",
  taskScope,
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useTasks({
    limit,
    offset,
    department_id: departmentId,
  });

  const { data: departments = [] } = useDepartments();

  const tasks: TaskType[] = data?.items ?? [];
  const total = data?.total ?? 0;

  // Обработчик смены размера страницы (сбрасываем на 1-ю страницу)
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Шапка страницы */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-zinc-700" />
            {taskScope === "department" ? "Задачи отдела" : "Все задачи"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {taskScope === "department"
              ? `Задач отдела: ${total}`
              : `Всего задач в системе: ${total}`}
          </p>
        </div>

        {canCreate ? (
            <Link href={`${taskBasePath}/new`}>
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Создать задачу
              </Button>
            </Link>
          ): (null)}
        </div>
        {taskScope && <TaskScopeToggle active={taskScope} />}
      </div>

      {/* Ошибка загрузки */}
      {isError && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
          Не удалось загрузить список задач. Попробуйте обновить страницу.
        </div>
      )}

      {/* Список задач */}
      {isLoading ? (
        <TasksSkeleton limit={limit} />
      ) : tasks.length === 0 ? (
        <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
          <CardContent className="p-12 text-center space-y-3">
            <FileText className="h-10 w-10 mx-auto text-zinc-400" />
            <p className="text-zinc-600 font-medium">Задачи не найдены</p>
            <p className="text-xs text-zinc-400">
              Создайте первую задачу, чтобы она появилась в списке
            </p>
          </CardContent>
        </Card>
      ) : (
        <TasksDepartments
          tasks={tasks}
          departments={departments}
          taskBasePath={taskBasePath}
        />
      )}

      {/* Пагинация */}
      <PaginationControl
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
      />
    </div>
  );
}

function TasksSkeleton({ limit }: { limit: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
        <Card key={i} className="border-zinc-200">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-1/3 bg-zinc-200" />
            <Skeleton className="h-3 w-2/3 bg-zinc-100" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20 bg-zinc-100" />
              <Skeleton className="h-4 w-24 bg-zinc-100" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
