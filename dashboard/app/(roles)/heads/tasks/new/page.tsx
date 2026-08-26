"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Paperclip,
  X,
  Loader2,
  Building2,
  Users,
  FileText,
  UploadCloud,
  AlertCircle,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import type { TaskCreateType } from "@/types/tasks";
import { useCreateHeadsTask } from "@/services/queries/heads/tasks";
import { useUsers, useMe } from "@/services/queries/users";
import { useDepartments } from "@/services/queries/departments"; // Импортируйте ваш хук получения отделов

export default function CreateTaskHeadsPage() {
  const router = useRouter();
  const createTask = useCreateHeadsTask();
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
  const { data: users = [] } = useUsers();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskCreateType>({
    defaultValues: {
      title: "",
      description: "",
      departments_ids: [],
      executor_ids: [],
      attachments: [],
    },
  });

  // Автоматически фиксируем отдел пользователя в форме
  useEffect(() => {
    if (me?.department_id) {
      setValue("departments_ids", [String(me.department_id)]);
    }
  }, [me, setValue]);

  const selectedDepartments = watch("departments_ids") || [];
  const selectedExecutors = watch("executor_ids") || [];
  const attachments = watch("attachments") || [];

  // Находим объект текущего отдела пользователя
  const userDepartment = departments.find(
    (dept) => String(dept.id) === String(me?.department_id)
  );

  // Фильтруем сотрудников по отделу пользователя
  const filteredUsers = users.filter((user) => {
    if (selectedDepartments.length === 0) return true;
    return selectedDepartments.includes(String(user.department_id));
  });

  // Автоматический сброс исполнителей, не входящих в выбранный отдел
  useEffect(() => {
    if (selectedDepartments.length === 0) return;

    const validExecutorIds = selectedExecutors.filter((id) =>
      filteredUsers.some((user) => String(user.id) === String(id)),
    );

    if (validExecutorIds.length !== selectedExecutors.length) {
      setValue("executor_ids", validExecutorIds);
    }
  }, [selectedDepartments, filteredUsers, selectedExecutors, setValue]);

  // Переключение выбора исполнителя
  const toggleExecutor = (userId: string) => {
    const next = selectedExecutors.includes(userId)
      ? selectedExecutors.filter((id) => id !== userId)
      : [...selectedExecutors, userId];
    setValue("executor_ids", next);
  };

  // Добавление файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setValue("attachments", [...attachments, ...newFiles]);
    }
  };

  // Удаление файла из списка
  const removeFile = (index: number) => {
    setValue(
      "attachments",
      attachments.filter((_, i) => i !== index),
    );
  };

  // Отправка формы
  const onSubmit = async (data: TaskCreateType) => {
    setServerError(null);

    try {
      await createTask.mutateAsync(data);
      router.push("/heads/tasks");
    } catch (err: any) {
      setServerError(
        err?.response?.data?.detail || "Ошибка при создании задачи",
      );
    }
  };

  // 1. Индикатор загрузки данных
  if (isMeLoading || isDepartmentsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  // 2. Отображение уведомления, если department_id отсутствует
  if (!me?.department_id) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <Card className="border-amber-200 bg-amber-50/30 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              Отдел не выбран
            </CardTitle>
            <CardDescription className="text-amber-800">
              Для создания задач необходимо привязать ваш аккаунт к отделу. Пожалуйста, укажите отдел в настройках вашего профиля.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Link href="/profile">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 w-full sm:w-auto">
                <User className="h-4 w-4 mr-2" />
                Перейти в профиль
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Основная форма создания задачи
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />К списку задач
      </Button>

      <Card className="border-zinc-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-700" />
            Создание новой задачи
          </CardTitle>
          <CardDescription>
            Заполните детали задачи, назначьте исполнителей и прикрепите файлы
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            {/* Название задачи */}
            <div className="space-y-2">
              <Label htmlFor="title">Название задачи *</Label>
              <Input
                id="title"
                placeholder="Например: Подготовить отчет по продажам"
                {...register("title", {
                  required: "Название задачи обязательно",
                })}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Описание */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Подробное описание задачи..."
                className="resize-y"
                {...register("description")}
              />
            </div>

            {/* Отдел (Простой текст) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-zinc-700">
                <Building2 className="h-4 w-4 text-zinc-500" />
                Отдел
              </Label>
              <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-800 font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-zinc-400 shrink-0" />
                {userDepartment?.title || "Загрузка названия отдела..."}
              </div>
            </div>

            {/* Исполнители */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-zinc-500" />
                Исполнители ({selectedExecutors.length})
              </Label>
              <div className="border border-zinc-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-2">
                    Нет доступных сотрудников
                  </p>
                ) : (
                  filteredUsers.map((user) => {
                    const userIdStr = String(user.id);
                    const isSelected = selectedExecutors.includes(userIdStr);
                    const name = user.last_name
                      ? `${user.last_name} ${user.username}`
                      : user.username;

                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleExecutor(userIdStr)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors ${
                          isSelected
                            ? "bg-zinc-100 text-zinc-900 font-medium"
                            : "hover:bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        <span>{name}</span>
                        {isSelected && (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-900 text-white text-[10px]"
                          >
                            Выбран
                          </Badge>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Загрузка файлов */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-zinc-500" />
                Прикрепленные файлы ({attachments.length})
              </Label>

              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-600 font-medium">
                  Нажмите или перетащите файлы для загрузки
                </p>
              </div>

              {/* Список добавленных файлов */}
              {attachments.length > 0 && (
                <ul className="space-y-1.5 pt-2">
                  {attachments.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-700"
                    >
                      <span className="truncate max-w-xs">{file.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-zinc-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-zinc-400 hover:text-red-600"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createTask.isPending}
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {(isSubmitting || createTask.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Создать задачу
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}