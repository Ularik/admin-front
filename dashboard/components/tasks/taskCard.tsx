"use client";

import { TaskType } from "@/types/tasks";
import Link from "next/link";
import {
  Building2,
  Users,
  Paperclip,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


interface Props {
    task: TaskType
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
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-900 text-base truncate">
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className="text-xs text-zinc-500 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Метаданные задачи */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-500">
              {/* Дата создания */}
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(task.created_at)}
              </span>

              {/* Отдел */}
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                {task.department_id
                  ? `Отдел #${task.department_id}`
                  : "Без отдела"}
              </span>

              {/* Исполнители */}
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-zinc-400" />
                {task.executors && task.executors.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {task.executors.map((user) => (
                      <Badge
                        key={user.id}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-zinc-200 font-normal text-zinc-700"
                      >
                        {user.last_name
                          ? `${user.last_name} ${user.username[0]}.`
                          : user.username}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-zinc-400">Не назначены</span>
                )}
              </div>

              {/* Вложения */}
              {task.attachments && task.attachments.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-zinc-100 text-zinc-600 gap-1 font-normal"
                >
                  <Paperclip className="h-3 w-3 text-zinc-400" />
                  {task.attachments.length}
                </Badge>
              )}
            </div>
          </div>

          <Link href={`tasks/${task.id}`}>
            <Button variant="outline" size="sm" className="shrink-0">
              Открыть
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
}