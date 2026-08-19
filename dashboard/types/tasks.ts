import { DocumentLiteType } from "./document";
import { UserType } from "./user";

export interface TaskCreateType {
  title: string;
  description?: string | null;
  department_id?: string | null;
  executor_ids: string[];
  attachments: File[];
}

export interface TaskType {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  department_id: string | null;
  executors: UserType[];
  attachments: DocumentLiteType[];
  created_at: Date;
  updated_at: Date;
}

export interface TasksApiResponseType {
  total: number;
  items: TaskType[];
}