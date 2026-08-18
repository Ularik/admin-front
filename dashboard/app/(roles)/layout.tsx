"use client";

import ProtectedLayout from "@/middlewares/ProtectedLayout";
import { type ReactNode } from "react";
import Sidebar from "@/components/sideBar/sideBar";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <ProtectedLayout roles={["ADMIN", "HEAD", "USER"]}>
      <div className="min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex flex-col min-w-0 lg:pl-72">

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
