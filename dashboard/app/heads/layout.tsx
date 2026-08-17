"use client";

import ProtectedLayout from "@/middlewares/ProtectedLayout";
import { type ReactNode } from "react";


type Props = {
  children: ReactNode;
};

export default function HeadLayout({ children }: Props) {
  return (  
  <ProtectedLayout roles={["HEAD"]}>
    {children}
  </ProtectedLayout>
  )
};