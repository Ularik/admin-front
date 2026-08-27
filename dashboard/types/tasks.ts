import { DepartmentLiteType, DepartmentType } from "./departments";
import { DocumentLiteType } from "./document";
import { UserType } from "./user";

export interface TaskCreateType {
  title: string;
  description?: string | null;
  departments_ids: string[];
  executor_ids: string[];
  attachments: File[];
}

export interface TaskUpdateType {
  id: string;
  title: string;
  description?: string | null;
  departments_ids: string[];
  executor_ids: string[];
  attachments: File[];
  old_attachments_ids: string[];
}


export interface TaskType {
  id: string;
  author_id: string;
  author: UserType;
  title: string;
  description: string | null;
  departments: DepartmentLiteType[];
  executors: UserType[];
  attachments: DocumentLiteType[];
  created_at: Date;
  updated_at: Date;
}

export interface TasksApiResponseType {
  total: number;
  items: TaskType[];
}