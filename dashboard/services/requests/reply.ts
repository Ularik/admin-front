import axiosApi from "@/lib/axiosApi";
import { ReplyCreateType, ReplyType } from "@/types/replies";


export async function createReply({task_id, data}: {task_id: string, data: ReplyCreateType}) {
    const formData = new FormData();
    formData.append("content", data.content);
    data.attachments.forEach((file) =>
        formData.append("attachments", file),
    );

    const result = await axiosApi.post(`/tasks/${task_id}/tasks_reply`, formData);
    return result.data;
};


export async function getReplies(task_id: string): Promise<ReplyType[]> {
    const result = await axiosApi.get(`/tasks/${task_id}/tasks_reply`);
    return result.data;
}

export async function deleteReply(reply_id: string) {
    await axiosApi.delete(`/tasks_reply/${reply_id}`);
}