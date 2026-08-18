import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDepartments, createDepartments } from "../requests/departments";


export const useDepartments = () => {
    return useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments
    });
};


export const useAddDepartments = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["departments"],
      mutationFn: createDepartments,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });
};