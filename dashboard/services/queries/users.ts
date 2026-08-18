import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { registerUser, login, getMe, logout, getUsers } from "@/services/requests/users";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
}

export function useUsers(department_id?: number) {
  return useQuery({
    queryKey: ["users"],
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