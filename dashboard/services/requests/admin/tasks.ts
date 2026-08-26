import type {
  TaskCreateType,
  TaskUpdateType,
} from "@/types/tasks";
import axiosApi from "@/lib/axiosApi";
import buildTaskFormData from "@/services/utils";


export async function postAdminTask(data: TaskCreateType) {
  const payload = buildTaskFormData(data);
  const res = await axiosApi.post("/admin/tasks/", payload);
  return res.data;
}

export async function putAdminTask(data: TaskUpdateType) {
  const { id, ...payload } = data;
  const form = buildTaskFormData(payload);
  const res = await axiosApi.put(`/admin/tasks/${id}`, form);
  return res.data;
}

export async function deleteAdminTask(id: string) {
  await axiosApi.delete(`/admin/tasks/${id}`);
}