"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, ArrowLeft } from "lucide-react";

import { TaskHeader } from "@/components/tasks/taskUpdate/taskHeader";
import { TaskMainInfo } from "@/components/tasks/taskUpdate/taskMainInfo";
import { TaskExecutors } from "@/components/tasks/taskUpdate/taskExecutors";

import {
  useTaskDetail,
} from "@/services/queries/tasks";
import { useDeleteHeadsTask, useUpdateHeadsTask } from "@/services/queries/heads/tasks";
import { useDepartments } from "@/services/queries/departments";
import { useUsers } from "@/services/queries/users";

import type { UserWithDepartment } from "@/types/user";
import type { DocumentLiteType } from "@/types/document";

interface TaskFormInputs {
  title: string;
  description: string;
  departments_ids: string[];
  executor_ids: string[];
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [existingFiles, setExistingFiles] = useState<DocumentLiteType[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const { data: task, isLoading, isError } = useTaskDetail(id);
  const deleteTask = useDeleteHeadsTask();
  const updateTask = useUpdateHeadsTask();

  const { data: departments = [] } = useDepartments();
  const { data: users = [] } = useUsers();

  const form = useForm<TaskFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      departments_ids: [],
      executor_ids: [],
    },
  });

  const selectedExecutors = form.watch("executor_ids") || [];

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        departments_ids: task.departments?.map((d) => String(d.id)) || [],
        executor_ids: task.executors?.map((e) => String(e.id)) || [],
      });
      setExistingFiles(task.attachments || []);
      setNewFiles([]);
    }
  }, [task, form]);

  const handleCancel = () => {
    if (task) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        departments_ids: task.departments?.map((d) => String(d.id)) || [],
        executor_ids: task.executors?.map((e) => String(e.id)) || [],
      });
      setExistingFiles(task.attachments || []);
      setNewFiles([]);
    }
    setIsEditing(false);
  };

  const toggleExecutor = (userId: string) => {
    const current = new Set(selectedExecutors);
    current.has(userId) ? current.delete(userId) : current.add(userId);
    form.setValue("executor_ids", Array.from(current));
  };

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      await updateTask.mutateAsync({
        id,
        title: data.title.trim(),
        description: data.description.trim() || null,
        departments_ids: data.departments_ids,
        executor_ids: data.executor_ids,
        attachments: newFiles,
        old_attachments_datas: existingFiles.map((f) => f.id),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(id);
      router.push("/heads/tasks");
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const getUserInitials = (u: Partial<UserWithDepartment>) =>
    u.last_name && u.username
      ? `${u.last_name[0]}${u.username[0]}`.toUpperCase()
      : "??";

  const getUserDisplayName = (u: Partial<UserWithDepartment>) =>
    u.last_name ? `${u.last_name} ${u.username}` : u.username || "Пользователь";

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) return <TaskDetailSkeleton />;

  if (isError || !task) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 space-y-3">
            <AlertTriangle className="h-10 w-10 mx-auto text-red-500" />
            <h2 className="text-lg font-semibold text-red-900">
              Задача не найдена
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      <TaskHeader
        isEditing={isEditing}
        isUpdating={updateTask.isPending}
        isDeleting={deleteTask.isPending}
        onEditToggle={setIsEditing}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskMainInfo
            taskId={task.id}
            isEditing={isEditing}
            form={form}
            departments={departments}
            currentDepartments={task.departments || []}
            existingFiles={existingFiles}
            newFiles={newFiles}
            onRemoveExistingFile={(fId) =>
              setExistingFiles((prev) => prev.filter((f) => f.id !== fId))
            }
            onRemoveNewFile={(idx) =>
              setNewFiles((prev) => prev.filter((_, i) => i !== idx))
            }
            onFileChange={(e) =>
              e.target.files &&
              setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)])
            }
          />
        </div>

        <div className="space-y-6">
          <TaskExecutors
            isEditing={isEditing}
            executors={task.executors || []}
            allUsers={users}
            selectedExecutors={selectedExecutors}
            onToggleExecutor={toggleExecutor}
            getUserInitials={getUserInitials}
            getUserDisplayName={getUserDisplayName}
          />

          <Card className="border-zinc-200 shadow-xs bg-zinc-50/50">
            <CardContent className="p-4 space-y-3 text-xs text-zinc-600">
              <div>
                <span className="text-zinc-400 block mb-1">Автор задачи</span>
                <p className="font-medium text-zinc-800">
                  {task.author.username} {task.author.last_name}
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Создана:</span>
                  <span className="font-medium text-zinc-800 ml-auto">
                    {formatDate(task.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Обновлена:</span>
                  <span className="font-medium text-zinc-800 ml-auto">
                    {formatDate(task.updated_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32 bg-zinc-200" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full bg-zinc-200 rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-[250px] w-full bg-zinc-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
