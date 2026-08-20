import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postTask,
  getTasks,
  getTaskDetail,
  deleteTask,
  putTask,
} from "../requests/tasks";
import { PagingParams } from "@/types/main";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
};

export const useTasks = (params: PagingParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
  });
};

export const useTaskDetail = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskDetail(id),
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};
