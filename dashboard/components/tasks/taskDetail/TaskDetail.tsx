"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, ArrowLeft, Lock } from "lucide-react";

import { TaskHeader } from "@/components/tasks/taskUpdate/taskHeader";
import { TaskMainInfo } from "@/components/tasks/taskUpdate/taskMainInfo";
import { TaskExecutors } from "@/components/tasks/taskUpdate/taskExecutors";

import { useTaskDetail } from "@/services/queries/tasks";
import { useDepartments } from "@/services/queries/departments";
import { useUsers } from "@/services/queries/users";

import type { UserType, UserWithDepartment } from "@/types/user";
import type { DocumentLiteType } from "@/types/document";
import { TaskUpdateType } from "@/types/tasks";

interface TaskFormInputs {
  title: string;
  description: string;
  departments_ids: string[];
  executor_ids: string[];
}

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
  user: UserType;
  updateTaskFunc: (data: TaskUpdateType) => void;
  deleteTaskFunc: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  redirectAfterDeletePath?: string;
}

export default function TaskDetail({
  params,
  user,
  updateTaskFunc,
  deleteTaskFunc,
  isUpdating = false,
  isDeleting = false,
  redirectAfterDeletePath = "/heads/tasks",
}: TaskDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [existingFiles, setExistingFiles] = useState<DocumentLiteType[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const { data: task, isLoading, isError } = useTaskDetail(id);

  const userDeptId = user?.department_id ? String(user.department_id) : null;
  const { data: departments = [] } = useDepartments();
  const { data: users = [] } = useUsers(user?.department_id ?? undefined);

  // Строгая проверка прав на редактирование:
  // 1. Админ может всё.
  // 2. Не админ может редактировать ТОЛЬКО если у задачи ровно 1 отдел и он совпадает с отделом пользователя.
  const canEdit = useMemo(() => {
    if (!user || !task) return false;
    if (user.status === "ADMIN") return true;

    const taskDepartments = task.departments || [];

    // Если у задачи несколько отделов или нет ни одного — только админ
    if (taskDepartments.length !== 1) return false;

    // Строгое сравнение с единственным отделом задачи
    const taskDeptId = String(taskDepartments[0].id);
    return Boolean(userDeptId && taskDeptId === userDeptId);
  }, [user, task, userDeptId]);

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
    if (!isEditing || !canEdit) return;
    const current = new Set(selectedExecutors);
    current.has(userId) ? current.delete(userId) : current.add(userId);
    form.setValue("executor_ids", Array.from(current));
  };

  const onSubmit = async (data: TaskFormInputs) => {
    if (!canEdit) return;
    try {
      await updateTaskFunc({
        id,
        title: data.title.trim(),
        description: data.description.trim() || null,
        departments_ids: data.departments_ids,
        executor_ids: data.executor_ids,
        attachments: newFiles,
        old_attachments_ids: existingFiles.map((f) => f.id),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    try {
      deleteTaskFunc(id);
      router.push(redirectAfterDeletePath);
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

  if (user?.status !== "ADMIN" && user?.department_id === null) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
      </div>
    );
  }

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

  const isMultiDepartmentTask = (task.departments?.length || 0) > 1;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {!canEdit && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600 shrink-0" />
          {isMultiDepartmentTask
            ? "Редактирование недоступно: задача затрагивает несколько отделов (только для Администратора)."
            : "Вы можете только просматривать эту задачу, так как она относится к другому отделу."}
        </div>
      )}

      <TaskHeader
        canEdit={canEdit}
        isEditing={isEditing && canEdit}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onEditToggle={canEdit ? setIsEditing : () => {}}
        onCancel={handleCancel}
        onDelete={canEdit ? handleDelete : () => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskMainInfo
            taskId={task.id}
            isEditing={isEditing && canEdit}
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
            isEditing={isEditing && canEdit}
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
