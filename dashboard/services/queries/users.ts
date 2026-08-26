import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { registerUser, login, getMe, logout, getUsers, userUpdate, userDetail } from "@/services/requests/users";
import { UserUpdateType } from "@/types/user";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userDetail(id),
  });
}

export function useUsers(department_id?: string) {
  return useQuery({
    queryKey: ["users", department_id],
    queryFn: () => getUsers(department_id),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useUserUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userUpdate,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["users"]})
  })
}