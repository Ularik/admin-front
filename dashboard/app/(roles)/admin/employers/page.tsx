"use client";

import Link from "next/link";
import {
  UserPlus,
  Crown,
  Users,
  Search,
  UserCheck,
  Building2,
} from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeCard } from "@/components/users/usersCard";
import { useUsers } from "@/services/queries/users";

export interface UserWithDepartment {
  id: string;
  username: string;
  last_name: string | null;
  status: string;
  department_id: string | null;
  department_title: string | null;
}

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

  // Группировка обычных сотрудников по department_id с отображением department_title
  const employeesByDepartment = useMemo(() => {
    const groups: Record<
      string,
      { title: string; users: UserWithDepartment[] }
    > = {};

    regularEmployees.forEach((employee) => {
      const deptId = employee.department_id || "no_department";
      const deptTitle = employee.department_title || "Без отдела";

      if (!groups[deptId]) {
        groups[deptId] = {
          title: deptTitle,
          users: [],
        };
      }

      groups[deptId].users.push(employee);
    });

    return groups;
  }, [regularEmployees]);

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
      {/* Шапка страницы */}
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

          {/* Кнопка добавления */}
          <Link href="/admin/employers/new">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </Link>
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Руководство (Левая колонка) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-zinc-900">Руководство</h2>
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

        {/* Отделы и сотрудники (Правая секция) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <UserCheck className="h-5 w-5 text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Сотрудники по отделам
            </h2>
            <Badge variant="secondary" className="ml-auto font-mono">
              {regularEmployees.length}
            </Badge>
          </div>

          {Object.keys(employeesByDepartment).length === 0 ? (
            <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
              <CardContent className="p-12 text-center text-sm text-zinc-500">
                {search ? "Сотрудники не найдены" : "Список сотрудников пуст"}
              </CardContent>
            </Card>
          ) : (
            /* Колонки отделов */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {Object.entries(employeesByDepartment).map(
                ([deptId, { title, users: deptUsers }]) => (
                  <div key={deptId} className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-zinc-200">
                      <Building2 className="h-4 w-4 text-zinc-500" />
                      <h3 className="font-medium text-sm text-zinc-700">
                        {title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs font-mono"
                      >
                        {deptUsers.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {deptUsers.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          user={employee}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
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
        <div className="lg:col-span-4 space-y-3">
          <div className="h-6 bg-zinc-200 rounded w-1/2 mb-4" />
          <div className="h-24 bg-zinc-200 rounded-lg" />
          <div className="h-24 bg-zinc-200 rounded-lg" />
        </div>
        <div className="lg:col-span-8 space-y-3">
          <div className="h-6 bg-zinc-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-5 bg-zinc-200 rounded w-1/3 mb-2" />
              <div className="h-20 bg-zinc-200 rounded-lg" />
              <div className="h-20 bg-zinc-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-zinc-200 rounded w-1/3 mb-2" />
              <div className="h-20 bg-zinc-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
