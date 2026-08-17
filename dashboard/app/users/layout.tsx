"use client";

import ProtectedLayout from "@/middlewares/ProtectedLayout";
import { type ReactNode } from "react";


type Props = {
  children: ReactNode;
};

export default function UserLayout({ children }: Props) {
  return (  
  <ProtectedLayout roles={["USER"]}>
    {children}
  </ProtectedLayout>
  )
};