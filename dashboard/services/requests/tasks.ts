import type {
  TasksApiResponseType,
  TaskType,
} from "@/types/tasks";
import axiosApi from "@/lib/axiosApi";
import { PagingParams } from "@/types/main";


export async function getTasks(
  params: PagingParams,
): Promise<TasksApiResponseType> {
  const res = await axiosApi.get("/tasks/", {
    params: {
      limit: params.limit,
      offset: params.offset,
    },
  });
  return res.data;
}

export async function getTaskDetail(id: string): Promise<TaskType> {
  const res = await axiosApi.get(`/tasks/${id}`);
  return res.data;
}
