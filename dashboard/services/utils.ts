import type {
  TaskCreateType,
  TaskUpdateType,
} from "@/types/tasks";


export default function buildTaskFormData(
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

  if ("old_attachments_ids" in data) {
    data.old_attachments_ids.forEach((id) => {
      formData.append("old_attachments_ids", id);
    });
  }

  return formData;
}