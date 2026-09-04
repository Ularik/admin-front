"use client";

import { useState } from "react";
import { useTasks } from "@/services/queries/tasks";

interface TaskStatusCountersProps {
  departmentId?: string;
}

export default function TaskStatusCounters({
  departmentId,
}: TaskStatusCountersProps) {
  const [periodDays, setPeriodDays] = useState(5);
  const periodStart = new Date();
  periodStart.setHours(0, 0, 0, 0);
  periodStart.setDate(periodStart.getDate() - periodDays);
  const fromDate = periodStart.toISOString().slice(0, 10);
  const toDate = new Date().toISOString().slice(0, 10);

  const { data: doneData } = useTasks({
    limit: 1,
    offset: 0,
    status: ["DONE"],
    department_id: departmentId,
    from_date: fromDate,
    to_date: toDate,
  });
  const { data: activeData } = useTasks({
    limit: 1,
    offset: 0,
    status: ["NEW", "PROGRESS"],
    department_id: departmentId,
    from_date: fromDate,
    to_date: toDate,
  });

  return (
    <section className="border-b border-zinc-200 pb-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Сводка по всем задачам
        </h2>
        <label className="flex items-center gap-2 text-[11px] text-zinc-500">
          За последние
          <input
            type="number"
            min={1}
            value={periodDays}
            onChange={(event) => {
              setPeriodDays(Math.max(1, Number(event.target.value) || 1));
            }}
            className="h-8 w-16 rounded-md border border-zinc-200 bg-white px-2 text-center text-xs"
          />
          дней
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-2 text-center">
          <p className="text-lg font-semibold leading-none text-emerald-700">
            {doneData?.total ?? 0}
          </p>
          <p className="mt-1 text-[10px] text-emerald-600">DONE</p>
        </div>
        <div className="rounded-md border border-amber-100 bg-amber-50 px-2 py-2 text-center">
          <p className="text-lg font-semibold leading-none text-amber-700">
            {activeData?.total ?? 0}
          </p>
          <p className="mt-1 text-[10px] text-amber-600">NEW + PROGRESS</p>
        </div>
      </div>
    </section>
  );
}
