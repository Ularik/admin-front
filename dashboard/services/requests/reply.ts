import axiosApi from "@/lib/axiosApi";
import { ReplyCreateType } from "@/types/replies";


export async function createReply({task_id, data}: {task_id: string, data: ReplyCreateType}) {
    const formData = new FormData();
    formData.append("content", data.content);
    data.attachments.forEach((file) =>
        formData.append("attachments", file),
    );

    const result = await axiosApi.post(`/tasks/${task_id}/tasks_reply`, formData);
    return result.data;
};