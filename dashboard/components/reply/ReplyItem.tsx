"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Paperclip, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import type { DocumentLiteType } from "@/types/document";
import type { ReplyType } from "@/types/replies";

interface ReplyItemProps {
  reply: ReplyType;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  // Опционально: состояние для разворачивания текста по клику
  const [isExpanded, setIsExpanded] = useState(false);

  const mockAuthorName = "Неизвестный сотрудник";
  const mockDate = "2026-09-01T14:30:00Z";

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="p-4 rounded-lg border border-zinc-100 bg-zinc-50/40 space-y-3">
      {/* Шапка ответа */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 text-xs bg-zinc-200 text-zinc-700 font-medium">
            <AvatarFallback>
              {getInitials(reply.author?.username || mockAuthorName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-xs text-zinc-900">
              {reply.author?.username || mockAuthorName}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <User className="h-3 w-3 text-zinc-400" />
              <span>Сотрудник</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-400 shrink-0">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(mockDate)}</span>
        </div>
      </div>

      {/* Текст ответа с фиксацией длины */}
      <div>
        <p
          className={`text-xs text-zinc-700 whitespace-pre-line leading-relaxed ${
            !isExpanded ? "line-clamp-3" : "" // Ограничение в 3 строки
          }`}
        >
          {reply.content}
        </p>

        {/* Кнопка "Читать далее", если текст длинный (опционально) */}
        {reply.content.length > 150 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5 cursor-pointer"
          >
            {isExpanded ? (
              <>
                Свернуть <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Показать полностью <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Вложения */}
      {reply.attachments && reply.attachments.length > 0 && (
        <div className="pt-2 border-t border-zinc-200/60 space-y-1.5">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            Прикрепленные файлы ({reply.attachments.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {reply.attachments.map((file: DocumentLiteType) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-2 rounded-md bg-white border border-zinc-200 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span className="truncate max-w-[180px]">{file.filename}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}