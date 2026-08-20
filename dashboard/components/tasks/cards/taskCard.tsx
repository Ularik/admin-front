"use client";

import { TaskType } from "@/types/tasks";
import Link from "next/link";
import { Building2, Users, Paperclip, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  task: TaskType;
}

export default function TaskCard({ task }: Props) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card
      key={task.id}
      className="border-zinc-200 hover:border-zinc-300 transition-colors shadow-xs"
    >
      {/* Уменьшены вертикальные отступы: py-3 sm:py-3.5 вместо p-4 sm:p-5 */}
      <CardContent className="px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Сверху: Отдел и Исполнители */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-600">
            {/* Отдел */}
            <span className="flex items-center gap-1.5 font-medium bg-zinc-100 px-2 py-0.5 rounded-md">
              <Building2 className="h-3.5 w-3.5 text-zinc-500" />
              {task.department_id
                ? `Отдел #${task.department_id}`
                : "Без отдела"}
            </span>

            {/* Исполнители */}
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              {task.executors && task.executors.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.executors.map((user) => (
                    <Badge
                      key={user.id}
                      variant="outline"
                      className="text-[11px] px-2 py-0 border-zinc-200 font-medium text-zinc-800 bg-white"
                    >
                      {user.last_name
                        ? `${user.last_name} ${user.username[0]}.`
                        : user.username}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-zinc-400 italic">Не назначены</span>
              )}
            </div>
          </div>

          {/* Заголовок задачи (убран pt-1) */}
          <h3 className="font-semibold text-zinc-900 text-base truncate">
            {task.title}
          </h3>

          {/* Описание задачи */}
          {task.description && (
            <p className="text-xs text-zinc-500 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Снизу: Дата и файлы (убран pt-1, уменьшен gap между элементами) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            {/* Дата создания */}
            <span className="flex items-center gap-1 text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(task.created_at)}
            </span>

            {/* Вложения со списками имен файлов (filename) */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                {task.attachments.map((file, idx) => (
                  <Badge
                    key={file.id || idx}
                    variant="secondary"
                    className="text-[10px] bg-zinc-100 text-zinc-700 font-normal max-w-[150px] truncate"
                    title={file.filename}
                  >
                    {file.filename}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Кнопка действий */}
        <Link href={`tasks/${task.id}`}>
          <Button variant="outline" size="sm" className="shrink-0">
            Открыть
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
