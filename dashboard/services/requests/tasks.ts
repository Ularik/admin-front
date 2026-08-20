import type {
  TaskCreateType,
  TasksApiResponseType,
  TaskType,
  TaskUpdateType,
} from "@/types/tasks";
import axiosApi from "@/lib/axiosApi";
import { PagingParams } from "@/types/main";

export function buildTaskFormData(
  data: TaskUpdateType | TaskCreateType,
): FormData {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description != null) {
    formData.append("description", data.description);
  }

  for (const dep_id of data.departments_ids) {
    formData.append("departments_ids", dep_id);
  }

  for (const executorId of data.executor_ids) {
    formData.append("executor_ids", executorId);
  }

  for (const file of data.attachments) {
    formData.append("attachments", file);
  }

    if ("old_attachments_datas" in data) {
      data.old_attachments_datas.forEach((id) => {
        formData.append("old_attachments_datas", id);
      });
    }

  return formData;
}

export async function postTask(data: TaskCreateType) {
  const payload = buildTaskFormData(data);
  const res = await axiosApi.post("/admin/tasks/", payload);
  return res.data;
}

export async function putTask(data: TaskUpdateType) {
  const { id, ...payload } = data;
  const form = buildTaskFormData(payload);
  const res = await axiosApi.put(`/admin/tasks/${id}`, form);
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