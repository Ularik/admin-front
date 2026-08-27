"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Lock,
  Trash2,
  Loader2,
  Pencil,
  X,
  Check,
  MessageSquarePlus,
} from "lucide-react";

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
  // Параметр для гибкого построения ссылки на страницу ответа (если нужно использовать разные префиксы роутов)
  replyBasePath?: string;
}

export default function TaskDetail({
  params,
  user,
  updateTaskFunc,
  deleteTaskFunc,
  isUpdating = false,
  isDeleting = false,
  redirectAfterDeletePath = "/heads/tasks",
  replyBasePath = "/heads/tasks",
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

  // Права на редактирование
  const canEdit = useMemo(() => {
    if (!user || !task) return false;
    if (user.status === "ADMIN") return true;

    const taskDepartments = task.departments || [];
    if (taskDepartments.length !== 1) return false;

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
      updateTaskFunc({
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

      {/* Встроенная Шапка (TaskHeader) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />К списку задач
        </Button>

        <div className="flex items-center gap-2">
          {/* Кнопка создания ответа доступна всегда, когда форма не в режиме редактирования */}
          {!isEditing && (
            <Link
              href={`${replyBasePath}/${id}/reply`}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "bg-zinc-900 text-white hover:bg-zinc-800",
              })}
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Отправить ответ
            </Link>
          )}

          {canEdit && (
            <>
              {!isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-zinc-700 border-zinc-300"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                      })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Задача будет
                          безвозвратно удалена из системы.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeleting && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isUpdating}
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Сохранить
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

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
