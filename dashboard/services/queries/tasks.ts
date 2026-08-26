import { useQuery } from "@tanstack/react-query";
import {
  getTasks,
  getTaskDetail,
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
