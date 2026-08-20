"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Crown, Users, Search, UserCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeCard } from "@/components/users/usersCard";
import { useUsers } from "@/services/queries/users";

const STATUS_PRIORITY: Record<string, number> = {
  ADMIN: 1,
  HEAD: 2,
  DEPUTY: 3,
};

export default function EmployeesPage() {
  const { data: users = [], isLoading, isError } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        (user.last_name && user.last_name.toLowerCase().includes(query)),
    );
  }, [users, search]);

  const leaders = useMemo(() => {
    return filteredUsers
      .filter((u) => u.status in STATUS_PRIORITY)
      .sort(
        (a, b) =>
          (STATUS_PRIORITY[a.status] || 99) - (STATUS_PRIORITY[b.status] || 99),
      );
  }, [filteredUsers]);

  const regularEmployees = useMemo(() => {
    return filteredUsers.filter((u) => !(u.status in STATUS_PRIORITY));
  }, [filteredUsers]);

  if (isLoading) return <EmployeesSkeleton />;

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Не удалось загрузить список сотрудников.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-zinc-700" />
            Сотрудники компании
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Всего: {users.length} | Руководство и админ.: {leaders.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Поиск */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-zinc-200 focus-visible:ring-zinc-900"
            />
          </div>

          {/* Кнопка перехода к форме создания */}
          <Link href="/admin/employers/new">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Руководство (Левая колонка) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Руководство и администрация
            </h2>
            <Badge variant="secondary" className="ml-auto font-mono">
              {leaders.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {leaders.length === 0 ? (
              <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
                <CardContent className="p-6 text-center text-sm text-zinc-500">
                  {search ? "Сотрудники не найдены" : "Состав не назначен"}
                </CardContent>
              </Card>
            ) : (
              leaders.map((leader) => (
                <EmployeeCard
                  key={leader.id}
                  user={leader}
                  variant="featured"
                />
              ))
            )}
          </div>
        </div>

        {/* Обычные сотрудники (Правая колонка) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <UserCheck className="h-5 w-5 text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Сотрудники отделов
            </h2>
            <Badge variant="secondary" className="ml-auto font-mono">
              {regularEmployees.length}
            </Badge>
          </div>

          {regularEmployees.length === 0 ? (
            <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
              <CardContent className="p-12 text-center text-sm text-zinc-500">
                {search ? "Сотрудники не найдены" : "Список сотрудников пуст"}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regularEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  user={employee}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeesSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 bg-zinc-200 rounded-md w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="h-6 bg-zinc-200 rounded w-1/2 mb-4" />
          <div className="h-24 bg-zinc-200 rounded-lg" />
          <div className="h-24 bg-zinc-200 rounded-lg" />
        </div>
        <div className="lg:col-span-7 space-y-3">
          <div className="h-6 bg-zinc-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-20 bg-zinc-200 rounded-lg" />
            <div className="h-20 bg-zinc-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
