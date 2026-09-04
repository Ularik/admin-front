import type {
  TasksApiResponseType,
  TaskType,
} from "@/types/tasks";
import axiosApi from "@/lib/axiosApi";
import { PagingParams } from "@/types/main";


export async function getTasks(
  params: PagingParams,
): Promise<TasksApiResponseType> {
  const queryParams = new URLSearchParams();
  queryParams.set("limit", String(params.limit));
  queryParams.set("offset", String(params.offset));

  if (params.department_id) queryParams.set("department_id", params.department_id);
  if (params.from_date) queryParams.set("from_date", params.from_date);
  if (params.to_date) queryParams.set("to_date", params.to_date);
  if (params.rush !== undefined) queryParams.set("rush", String(params.rush));
  params.status?.forEach((status) => queryParams.append("status", status));

  const res = await axiosApi.get("/tasks/", {
    params: queryParams,
  });
  return res.data;
}

export async function getTaskDetail(id: string): Promise<TaskType> {
  const res = await axiosApi.get(`/tasks/${id}`);
  return res.data;
}
