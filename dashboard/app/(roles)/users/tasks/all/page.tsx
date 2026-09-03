"use client";

import AllTasksList from "@/components/tasks/allTasksList/AllTasksList";
import { useMe } from "@/services/queries/users";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserAllTasksPage() {
  const { data: user, isPending } = useMe();

  if (isPending) {
    return <Skeleton className="mx-auto mt-6 h-96 max-w-7xl bg-zinc-200" />;
  }

  if (!user) return null;

  return (
    <AllTasksList
      user={user}
      canCreate={false}
      taskBasePath="/users/tasks"
      taskScope="all"
    />
  );
}
