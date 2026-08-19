import type { DepartmentType } from "@/types/departments"
import { Building2, ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import next from "next";

interface Props {
  dept: DepartmentType;
}


export default function DepCard({ dept }: Props) {
  return (
    <Card
      key={dept.id}
      className="group relative border-zinc-200 bg-white transition-all duration-200 hover:border-zinc-400 hover:shadow-md flex flex-col justify-between"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200">
            <Building2 size={20} />
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-mono font-medium text-zinc-600">
            ID: {dept.id}
          </span>
        </div>
        <CardTitle className="text-lg font-bold text-zinc-900 pt-2 group-hover:text-zinc-900">
          {dept.title}
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 line-clamp-2 min-h-[2.25rem]">
          {dept.description || "Описание отсутствует"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="border-t border-zinc-100 pt-3 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>
              {new Date(dept.created_at).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-zinc-900 font-medium group-hover:translate-x-0.5 transition-transform duration-200">
            <Link href={`/admin/departments/${dept.id}`}>
              <span>Подробнее</span>
            </Link>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}