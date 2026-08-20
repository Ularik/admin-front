"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";

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

import type { UserRegisterType } from "@/types/user";
import { useRegisterMutation } from "@/services/queries/users";
import { useDepartments } from "@/services/queries/departments";


export default function CreateEmployeePage() {
  const router = useRouter();
  const createUser = useRegisterMutation();
  const { data: departments = [] } = useDepartments();

  const [formData, setFormData] = useState<UserRegisterType>({
    username: "",
    last_name: "",
    password: "",
    status: "USER",
    department: null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim()) {
      setError("Имя пользователя обязательно");
      return;
    }

    try {
      await createUser.mutateAsync(formData);
      router.push("/admin/users");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Ошибка при создании сотрудника. Попробуйте снова.",
      );
    }
  };

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
            <UserPlus className="h-5 w-5 text-zinc-700" />
            Добавление нового сотрудника
          </CardTitle>
          <CardDescription>
            Заполните учетные данные и назначьте роль в системе
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Имя (username) */}
            <div className="space-y-2">
              <Label htmlFor="username">Имя (Логин) *</Label>
              <Input
                id="username"
                placeholder="Иван"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
            </div>

            {/* Фамилия (last_name) */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Фамилия</Label>
              <Input
                id="last_name"
                placeholder="Иванов"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Пароль (password) */}
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            {/* Роль / Статус (status) */}
            <div className="space-y-2">
              <Label>Роль в системе *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: UserRegisterType["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Сотрудник (USER)</SelectItem>
                  <SelectItem value="DEPUTY">
                    Зам. начальника (DEPUTY)
                  </SelectItem>
                  <SelectItem value="HEAD">Начальник отдела (HEAD)</SelectItem>
                  <SelectItem value="ADMIN">Администратор (ADMIN)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Отдел (department) */}
            <div className="space-y-2">
              <Label>Отдел</Label>
              <Select
                value={
                  formData.department !== null
                    ? String(formData.department)
                    : "none"
                }
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: value === "none" ? null : Number(value),
                  }))
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
                disabled={createUser.isPending}
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {createUser.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Создать сотрудника
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
