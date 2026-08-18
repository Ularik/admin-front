export interface DepartmentCreateType {
  title: string;
  description: string;
  head_id: number | null;
  deputy_head_id: number | null;
}


export interface DepartmentType {
  id: number;
  title: string;
  description: string;
  head_id: number | null;
  deputy_head_id: number | null;
  created_at: Date;
  updated_at: Date;
}