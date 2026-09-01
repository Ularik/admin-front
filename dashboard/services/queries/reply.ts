import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReply, getReplies, deleteReply } from "../requests/reply";
import { AxiosError } from "axios";
import type { ReplyCreateType } from "@/types/replies";
import { ApiErrorResponse } from "@/types/main";


export const useReplyCreate = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, AxiosError<ApiErrorResponse>, { task_id: string; data: ReplyCreateType }>({
        mutationFn: createReply,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["replies"]})
        }
    });
};


export const useReplyDelete = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
        mutationFn: deleteReply,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["replies"]})
        }
    });
};

export const useReplies = (task_id: string) => {
    return useQuery({
        queryKey: ["replies", task_id],
        queryFn: () => getReplies(task_id)
    })
};