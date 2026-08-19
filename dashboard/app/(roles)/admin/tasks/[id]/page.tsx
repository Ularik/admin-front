"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Users,
  Paperclip,
  Trash2,
  Download,
  FileText,
  UserCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import { useTaskDetail, useDeleteTaskMutation } from "@/services/queries/tasks";
import type { UserType } from "@/types/user";
import type { DocumentLiteType } from "@/types/document";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: task, isLoading, isError } = useTaskDetail(id);
  const deleteTask = useDeleteTaskMutation();

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(id);
      router.push("/tasks");
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserInitials = (user: UserType) => {
    if (user.last_name) {
      return `${user.last_name[0]}${user.username[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (user: UserType) => {
    return user.last_name
      ? `${user.last_name} ${user.username}`
      : user.username;
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (isError || !task) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 space-y-3">
            <AlertTriangle className="h-10 w-10 mx-auto text-red-500" />
            <h2 className="text-lg font-semibold text-red-900">
              Задача не найдена или была удалена
            </h2>
            <p className="text-xs text-red-600">
              Проверьте корректность ссылки или вернитесь к списку задач.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Навигация и Экшены */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />К списку задач
        </Button>

        {/* Диалог подтверждения удаления */}
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
            Удалить задачу
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Задача будет безвозвратно удалена
                из системы вместе со всеми прикрепленными связями.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteTask.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Основная карточка задачи */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Контент слева (2 колонки на десктопе) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-xs">
            <CardHeader className="space-y-3 border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-zinc-300 text-zinc-600"
                >
                  ID: #{task.id}
                </Badge>
                {task.department_id && (
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-700 font-normal flex items-center gap-1"
                  >
                    <Building2 className="h-3 w-3" />
                    Отдел #{task.department_id}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-zinc-900 leading-tight">
                {task.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Описание */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Описание задачи
                </h4>
                {task.description ? (
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Описание отсутствует
                  </p>
                )}
              </div>

              {/* Прикрепленные файлы */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Paperclip className="h-3.5 w-3.5" />
                  Прикрепленные файлы ({task.attachments?.length || 0})
                </h4>

                {task.attachments && task.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {task.attachments.map((file: DocumentLiteType) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg group hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                          <span className="text-xs font-medium text-zinc-700 truncate">
                            {file.filename}
                          </span>
                        </div>
                        <a
                          href={`/api/tasks/task-documents/${file.id}/download`}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-400 hover:text-zinc-900"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Нет прикрепленных файлов
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель справа (1 колонка на десктопе) */}
        <div className="space-y-6">
          {/* Исполнители */}
          <Card className="border-zinc-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-900">
                <Users className="h-4 w-4 text-zinc-500" />
                Исполнители ({task.executors?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {task.executors && task.executors.length > 0 ? (
                <ul className="space-y-3">
                  {task.executors.map((user: UserType) => (
                    <li key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-zinc-200 text-zinc-700 border border-zinc-200">
                        <AvatarFallback className="text-xs font-medium">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-zinc-900 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 bg-zinc-100 text-zinc-500 font-normal"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-xs text-zinc-400 italic flex items-center justify-center gap-1">
                  <UserCheck className="h-4 w-4 text-zinc-300" />
                  Исполнители не назначены
                </div>
              )}
            </CardContent>
          </Card>

          {/* Метаинформация о датах и авторе */}
          <Card className="border-zinc-200 shadow-xs bg-zinc-50/50">
            <CardContent className="p-4 space-y-3 text-xs text-zinc-600">
              <div>
                <span className="text-zinc-400 block mb-1">Автор задачи</span>
                <p className="font-medium text-zinc-800">
                  ID пользователя: #{task.author_id}
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
    </div>
  );
}

// Скелетон загрузки детализации
function TaskDetailSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32 bg-zinc-200" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200">
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-24 bg-zinc-200" />
              <Skeleton className="h-8 w-3/4 bg-zinc-200" />
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-4 w-full bg-zinc-100" />
              <Skeleton className="h-4 w-5/6 bg-zinc-100" />
              <Skeleton className="h-4 w-2/3 bg-zinc-100" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-zinc-200">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-full bg-zinc-200" />
              <Skeleton className="h-10 w-full bg-zinc-100" />
              <Skeleton className="h-10 w-full bg-zinc-100" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
