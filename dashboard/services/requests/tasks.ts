import type {
  TaskCreateType,
  TasksApiResponseType,
  TaskType,
} from "@/types/tasks";
import axiosApi from "@/lib/axiosApi";
import { PagingParams } from "@/types/main";

export async function buildTaskFormData(
  data: TaskCreateType,
): Promise<FormData> {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.department_id !== null && data.department_id !== undefined) {
    formData.append("department_id", data.department_id);
  }

  // Для списков в FastAPI повторяем append для каждого элемента
  data.executor_ids.forEach((id) => {
    formData.append("executor_ids", id);
  });

  data.attachments.forEach((file) => {
    formData.append("attachments", file);
  });

  return formData;
}

export async function postTask(data: TaskCreateType) {
  const payload = await buildTaskFormData(data);
  const res = await axiosApi.post("/admin/tasks/", payload);
  return res.data;
}

export async function getTasks(
  params: PagingParams,
): Promise<TasksApiResponseType> {
  const res = await axiosApi.get("/admin/tasks", {
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

export async function deleteTask(id: string) {
  await axiosApi.delete(`/admin/tasks/${id}`);
}