import axiosApi from "@/lib/axiosApi";
import type { DepartmentType, DepartmentCreateType } from "@/types/departments";

export async function getDepartments(): Promise<DepartmentType[]> {
  const res = await axiosApi.get("/departments");
  return res.data;
}

export async function createDepartments(body: DepartmentCreateType): Promise<DepartmentType> {
  const res = await axiosApi.post("/admin/departments/", body);
  return res.data;
}