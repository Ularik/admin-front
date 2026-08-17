"use client";

import ProtectedLayout from "@/middlewares/ProtectedLayout";
import { type ReactNode } from "react";


type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (  
  <ProtectedLayout roles={["ADMIN"]}>
    {children}
  </ProtectedLayout>
  )
};