import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReply } from "../requests/reply";
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
