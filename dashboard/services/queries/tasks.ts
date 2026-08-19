import { useMutation, useQuery } from "@tanstack/react-query";
import { postTask, getTasks, getTaskDetail, deleteTask } from "../requests/tasks";
import { PagingParams } from "@/types/main";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: postTask,
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