"use client";

import TaskDetail from "@/components/tasks/taskDetail/TaskDetail";
import { useMe } from "@/services/queries/users";
import {
  useUpdateAdminTask,
  useDeleteAdminTask,
} from "@/services/queries/admin/tasks";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: Promise<{ id: string }>
}

export default function TaskAdminDetailPage({
  params,
}: Props) {
  const { data: me, isLoading: isMeLoading } = useMe();
  const updateTask = useUpdateAdminTask();
  const deleteTask = useDeleteAdminTask();

  // Пока загружаются данные о пользователе, показываем скелетон
  if (isMeLoading || !me) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 bg-zinc-200" />
        <Skeleton className="h-[400px] w-full bg-zinc-200 rounded-lg" />
      </div>
    );
  }

  return (
    <TaskDetail
      params={params}
      user={me}
      updateTaskFunc={updateTask.mutateAsync}
      deleteTaskFunc={deleteTask.mutateAsync}
      isUpdating={updateTask.isPending}
      isDeleting={deleteTask.isPending}
      redirectAfterDeletePath="/admin/tasks"
    />
  );
}
