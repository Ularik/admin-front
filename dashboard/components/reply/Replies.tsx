"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { useReplies } from "@/services/queries/reply";
import { ReplyItem } from "./ReplyItem";

interface Props {
  taskId: string;
}

export default function Replies({ taskId }: Props) {
  const { data: replies, isLoading, isError } = useReplies(taskId);

  return (
    <Card className="border-zinc-200 shadow-xs bg-white">
      <CardHeader className="p-4 border-b border-zinc-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-zinc-500" />
          Ответы на задачу
        </CardTitle>
        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-normal">
          Всего: {replies?.length || 0}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {replies?.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500">
            На эту задачу пока нет ответов.
          </div>
        ) : (
          replies?.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))
        )}
      </CardContent>
    </Card>
  );
}