import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddDepartments } from "@/services/queries/departments";
import { useUsers } from "@/services/queries/users";
import type { DepartmentCreateType } from "@/types/departments";


interface Props {
    initialValue?: DepartmentCreateType;
    departmentId?: number
}

export default function DepartmentCreateForm({ initialValue, departmentId }: Props) {
  const router = useRouter();

      const { mutate: create, isPending, error } = useAddDepartments();

      const { data: users = [], isLoading: isUsersLoading } = useUsers();

      const {
        register,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<DepartmentCreateType>({
        defaultValues: {
          title: "",
          description: "",
          head_id: null,
          deputy_head_id: null,
        },
      });

      const onSubmit = async (data: DepartmentCreateType) => {
        create(data, {
          onSuccess: () => {
            toast.success("Отдел успешно создан");
            router.push("/admin/departments");
          },
          onError: () => {
            toast.error("Ошибка при создании");
          },
        });
      };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-zinc-200 bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900">
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Название отдела */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-semibold text-zinc-700"
            >
              Название отдела <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Например, Отдел веб-разработки"
              className="border-zinc-200 focus-visible:ring-zinc-900"
              {...register("title", {
                required: "Укажите название отдела",
                minLength: {
                  value: 2,
                  message: "Название должно содержать минимум 2 символа",
                },
              })}
            />
            {errors.title && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-zinc-700"
            >
              Описание
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Подробно опишите сферы ответственности и задачи отдела..."
              className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-zinc-400 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Руководство отдела */}
      <Card className="border-zinc-200 bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900">
            Руководящий состав
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Руководитель отдела */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700">
              Руководитель отдела
            </Label>
            <Controller
              control={control}
              name="head_id"
              render={({ field }) => (
                <Select
                  disabled={isUsersLoading}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : null)
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full border-zinc-200 focus:ring-zinc-900">
                    <SelectValue placeholder="Выберите руководителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.username || user.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Заместитель руководителя */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700">
              Заместитель руководителя
            </Label>
            <Controller
              control={control}
              name="deputy_head_id"
              render={({ field }) => (
                <Select
                  disabled={isUsersLoading}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : null)
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full border-zinc-200 focus:ring-zinc-900">
                    <SelectValue placeholder="Выберите заместителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.username || user.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Действия */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-zinc-200 text-zinc-700 hover:bg-zinc-100"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save size={16} />
              Создать отдел
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
