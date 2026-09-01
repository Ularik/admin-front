"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  User,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { use } from "react";
import type { ReplyType } from "@/types/replies";
import type { DocumentLiteType } from "@/types/document";

interface Props {
  params: Promise<{ reply_id: string; id: string }>;
}

export default function ReplyDetail({ params }: Props) {

    const { reply_id, id } = use(params);
    
  const getUserInitials = (u: ReplyType["author"]) => {
    if (!u) return "??";
    if (u.last_name && u.username) {
      return `${u.last_name[0]}${u.username[0]}`.toUpperCase();
    }
    return (u.username?.[0] || "U").toUpperCase();
  };

  const getUserDisplayName = (u: ReplyType["author"]) => {
    if (!u) return "Неизвестный сотрудник";
    return u.last_name ? `${u.last_name} ${u.username}` : u.username;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Шапка / Навигация */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
          <Link href={`/tasks/${reply.task_id}`}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Назад к задаче
          </Link>
        </Button>

        <Badge variant="outline" className="text-xs font-normal text-zinc-500 bg-zinc-50">
          ID ответа: <span className="font-mono ml-1 text-zinc-700">{reply.id}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной контент */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-xs bg-white">
            <CardHeader className="pb-4 border-b border-zinc-100 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-zinc-500" />
                Детали ответа
              </CardTitle>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[11px] gap-1 font-normal">
                <CheckCircle2 className="h-3 w-3" /> Отправлено
              </Badge>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Информация об авторе */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/50">
                <Avatar className="h-10 w-10 border border-zinc-200 bg-zinc-100 text-zinc-700">
                  <AvatarFallback className="text-sm font-medium">
                    {getUserInitials(reply.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-900 truncate">
                    {getUserDisplayName(reply.author)}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                    <User className="h-3 w-3 text-zinc-400" />
                    {reply.author?.username || reply.author?.status || "Сотрудник"}
                  </p>
                </div>
              </div>

              {/* Текст ответа */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Содержание ответа
                </h4>
                <div className="p-4 rounded-lg border border-zinc-200/80 bg-white text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                  {reply.content || (
                    <span className="text-zinc-400 italic">Текст ответа отсутствует</span>
                  )}
                </div>
              </div>

              {/* Прикрепленные документы */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" />
                  Прикрепленные файлы ({reply.attachments?.length || 0})
                </h4>

                {reply.attachments && reply.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {reply.attachments.map((file: DocumentLiteType) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="p-1.5 rounded-md bg-zinc-100 group-hover:bg-zinc-200/60 transition-colors shrink-0">
                            <FileText className="h-4 w-4 text-zinc-600" />
                          </div>
                          <span className="text-xs font-medium text-zinc-700 truncate" title={file.filename}>
                            {file.filename}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-zinc-900 shrink-0"
                        >
                          {/* Укажите ваш эндпоинт для скачивания документа по file.id */}
                          <a
                            href={`/api/documents/${file.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-zinc-200 rounded-lg text-xs text-zinc-400">
                    К этому ответу не прикреплено ни одного файла
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель с метаданными */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                Связанная задача
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-[11px] text-zinc-400">Идентификатор задачи</p>
                <p className="text-xs font-mono font-medium text-zinc-800 mt-0.5 truncate">
                  {reply.task_id}
                </p>
              </div>

              {taskTitle && (
                <div>
                  <p className="text-[11px] text-zinc-400">Название задачи</p>
                  <p className="text-xs font-medium text-zinc-800 mt-0.5 line-clamp-2">
                    {taskTitle}
                  </p>
                </div>
              )}

              <Separator className="bg-zinc-100" />

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8 justify-between"
              >
                <Link href={`/tasks/${reply.task_id}`}>
                  <span>Перейти к задаче</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}