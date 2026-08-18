"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/services/queries/departments";
import DepCard from "@/components/departments/DepCard";
import Link from "next/link";


export default function DepartmentsPage() {
  const {
    data: displayDepartments = [],
    isLoading,
    isError,
  } = useDepartments();


  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Шапка страницы */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Отделы компании
          </h1>
          <p className="text-sm text-zinc-500">
            Управление структурами, подразделениями
          </p>
        </div>
        <Link href="/admin/departments/new">
          <Button className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm">
            <Plus size={16} />
            <span>Создать отдел</span>
          </Button>
        </Link>
      </div>

      {/* Модальное окно создания отдела */}

      {/* Список или скелетон */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-zinc-200 bg-white shadow-xs">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32 bg-zinc-100" />
                <Skeleton className="h-4 w-full bg-zinc-100" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-3/4 bg-zinc-100" />
                <Skeleton className="h-3 w-1/2 bg-zinc-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Не удалось загрузить список отделов. Проверьте соединение с сервером.
        </div>
      ) : (
        /* Грид-сетка отделов */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayDepartments.map((dept) => (
            <DepCard key={dept.id} dept={dept} />
          ))}
        </div>
      )}
    </div>
  );
}
