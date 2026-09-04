"use client";

import { use } from "react";
import { ArrowLeft, Calendar, CalendarClock, FileText, MessageSquarePlus, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskDetail } from "@/services/queries/tasks";
import { useMe } from "@/services/queries/users";
import Replies from "@/components/reply/Replies";

export default function UserTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: task, isPending, isError } = useTaskDetail(id);
  const { data: user, isPending: isUserPending } = useMe();

  if (isPending || isUserPending) return <TaskDetailSkeleton />;

  const hasDepartmentAccess = Boolean(
    user?.department_id &&
      task?.departments?.some(
        (department) => String(department.id) === String(user.department_id),
      ),
  );
  const isAssignedExecutor = Boolean(
    user?.id && task?.executors?.some((executor) => executor.id === user.id),
  );

  if (isError || !task || !hasDepartmentAccess) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <Link href="/users/tasks" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" /> Назад к задачам
        </Link>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center text-sm text-red-700">Задача не найдена или недоступна.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/users/tasks" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Назад к задачам
      </Link>
      <Card className="border-zinc-200">
        <CardContent className="space-y-6 p-6">
          <div className="border-b border-zinc-200 pb-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500"><FileText className="h-4 w-4" /> Задача</div>
            <h1 className="mt-2 text-2xl font-bold text-zinc-900">{task.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {task.departments?.map((department) => <Badge key={department.id} variant="secondary">{department.title}</Badge>)}
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">{task.description || "Описание отсутствует."}</p>
          <div className="grid gap-4 border-t border-zinc-200 pt-5 text-sm text-zinc-500 sm:grid-cols-2">
            <div className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4" /><span>Исполнители: {task.executors?.map((executor) => `${executor.last_name} ${executor.username}`).join(", ") || "Не назначены"}</span></div>
            <div className="flex items-start gap-2"><Calendar className="mt-0.5 h-4 w-4" /><span>Создана: {new Date(task.created_at).toLocaleDateString("ru-RU")}</span></div>
            <div className="flex items-start gap-2"><CalendarClock className="mt-0.5 h-4 w-4" /><span>Срок: {task.deadlines ? new Date(task.deadlines).toLocaleDateString("ru-RU") : "Не указан"}</span></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Ответы исполнителей</h2>
        {isAssignedExecutor && (
          <Link
            href={`/users/tasks/${task.id}/reply`}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Отправить ответ
          </Link>
        )}
      </div>
      <Replies
        taskId={task.id}
        replyBasePath={`/users/tasks/${task.id}`}
        onlyOwnReplyLinks
      />
    </div>
  );
}

function TaskDetailSkeleton() {
  return <div className="mx-auto max-w-3xl space-y-5 p-6"><Skeleton className="h-5 w-32 bg-zinc-200" /><Skeleton className="h-96 w-full bg-zinc-200" /></div>;
}
