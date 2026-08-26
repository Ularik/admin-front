"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, UserCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { UserUpdateType } from "@/types/user";
import { useUserDetail, useUserUpdate } from "@/services/queries/users";
import { useDepartments } from "@/services/queries/departments";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading: isUserLoading } = useUserDetail(userId);
  const updateUser = useUserUpdate();
  const { data: departments = [] } = useDepartments();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserUpdateType>({
    defaultValues: {
      username: "",
      last_name: "",
      status: "USER",
      department_id: null,
    },
  });

  // Заполняем форму, когда данные пользователя загрузились
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        last_name: user.last_name || "",
        status: user.status || "USER",
        department_id: user.department_id ? String(user.department_id) : null,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserUpdateType) => {
    setServerError(null);

    try {
      await updateUser.mutateAsync({ id: userId, data });
      router.push("/admin/employers");
    } catch (err: any) {
      setServerError(
        err.response?.data?.detail ||
          "Ошибка при обновлении сотрудника. Попробуйте снова.",
      );
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Кнопка «Назад» */}
      <div className="flex items-center gap-4 border-b border-zinc-200 pb-5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="border-zinc-200 text-zinc-700 hover:bg-zinc-100"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="block">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            К списку сотрудников
          </h1>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-zinc-700" />
            Редактирование сотрудника
          </CardTitle>
          <CardDescription>
            Измените персональные данные, статус или привязку к отделу
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            {/* Имя (username) */}
            <div className="space-y-2">
              <Label htmlFor="username">Имя (Логин) *</Label>
              <Input
                id="username"
                placeholder="Иван"
                {...register("username", {
                  required: "Имя пользователя обязательно",
                  validate: (val) =>
                    !val ||
                    val.trim().length > 0 ||
                    "Имя не может состоять из пробелов",
                })}
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Фамилия (last_name) */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Фамилия</Label>
              <Input
                id="last_name"
                placeholder="Иванов"
                {...register("last_name")}
              />
            </div>

            {/* Роль / Статус (status) */}
            <div className="space-y-2">
              <Label>Роль в системе *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Выберите роль" }}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Сотрудник (USER)</SelectItem>
                      <SelectItem value="DEPUTY">
                        Зам. начальника (DEPUTY)
                      </SelectItem>
                      <SelectItem value="HEAD">
                        Начальник отдела (HEAD)
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        Администратор (ADMIN)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Отдел (department_id) */}
            <div className="space-y-2">
              <Label>Отдел</Label>
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={
                      field.value !== null && field.value !== undefined
                        ? String(field.value)
                        : "none"
                    }
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? null : val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без отдела</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.title || `Отдел #${dept.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Кнопки действия */}
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
                disabled={updateUser.isPending || !isDirty}
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {updateUser.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Сохранить изменения
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
