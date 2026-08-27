import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReply } from "../requests/reply";


export const useReplyCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReply,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["replies"]})
        }
    });
};
