import { UserType } from "./user";

export interface DepartmentCreateType {
  title: string;
  description: string;
  head_id: string | null;
  deputy_head_id: string | null;
}

export interface DepartmentType {
  id: string;
  title: string;
  description: string;
  head: UserType | null;
  deputy_head: UserType | null;
  created_at: Date;
  updated_at: Date;
}


export interface DepartmentLiteType {
  id: string;
  title: string;
}

export interface DepartmentUpdateType {
  id: string;
  title: string;
  description: string;
  head_id: string | null;
  deputy_head_id: string | null;
}