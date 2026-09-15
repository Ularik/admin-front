import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  getTaskDetail,
  patchTaskStatus,
  postTask,
  putTask,
  deleteTask
} from "../requests/tasks";
import { PagingParams } from "@/types/main";

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
    },
  });
};

export const usePatchTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTaskStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
    },
  });
};


export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });
}