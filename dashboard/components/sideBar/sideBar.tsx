"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { dashboardMenuItems, roleDashboardPaths } from "@/constants/main";
import { useLogout, useMe } from "@/services/queries/users";
import { toast } from "sonner";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user } = useMe();
  const logoutMutation = useLogout();

  if (!user) return null;

  const filteredItems = dashboardMenuItems.filter((item) =>
    item.roles.includes(user.status),
  );

  const handleLogout = async () => {
    try {
      logoutMutation.mutate();
    } catch {
      toast.error("Не удалось завершить сессию на сервере");
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-72 border-r border-zinc-200 bg-white">
      {/* Шапка сайдбара / Логотип */}
      <div className="border-b border-zinc-200 px-6 py-5">
        <Link
          href={roleDashboardPaths[user.status]}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-900">
              CERT 
            </h1>
            <p className="text-xs text-zinc-500">Studio Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Навигация */}
      <nav className="scrollbar-thin flex flex-col gap-1.5 p-4 overflow-y-auto flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Футер сайдбара / Профиль и Выход */}
      <div className="border-t border-zinc-200 p-4 space-y-3">
        <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100 flex items-center justify-between">
          <div className="truncate">
            <p className="text-sm font-semibold text-zinc-900 truncate">
              {user.username}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {user.status}
            </p>
          </div>
          <span className="inline-flex items-center rounded-md bg-zinc-200/70 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
            Active
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 shadow-xs"
        >
          <LogOut size={16} />
          {logoutMutation.isPending ? "Выход..." : "Выйти"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
