"use client";

import Link from "next/link";
import { Building2, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TaskType } from "@/types/tasks";

interface Props {
  task: TaskType;
}

export default function TaskKanbanCard({ task }: Props) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <Link href={`/admin/tasks/${task.id}`} className="block group">
      <Card className="border-zinc-200 py-1 group-hover:border-zinc-400 group-hover:shadow-sm transition-all bg-white cursor-pointer">
        <CardContent className="p-3 space-y-2.5">
          {/* 1. Сверху: Отдел и Исполнители */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
            {/* Отдел */}
            <span className="flex items-center gap-1 font-medium text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px]">
              <Building2 className="h-3 w-3 text-zinc-500 shrink-0" />
              <span className="truncate max-w-[120px]">
                {task.department_id
                  ? `Отдел #${task.department_id}`
                  : "Без отдела"}
              </span>
            </span>

            {/* Исполнители */}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-zinc-400 shrink-0" />
              {task.executors && task.executors.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.executors.map((user) => (
                    <Badge
                      key={user.id}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-zinc-200 font-normal text-zinc-700 bg-zinc-50/50"
                    >
                      {user.last_name
                        ? `${user.last_name} ${user.username[0]}.`
                        : user.username}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] text-zinc-400 italic">
                  Не назначен
                </span>
              )}
            </div>
          </div>

          {/* 2. Заголовок задачи */}
          <h4 className="font-medium text-zinc-900 text-sm line-clamp-2 group-hover:text-zinc-700 leading-snug">
            {task.title}
          </h4>

          {/* 3. Снизу: Дата */}
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 pt-0.5 border-t border-zinc-100">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
