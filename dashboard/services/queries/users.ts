import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/requests/users";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/requests/users";


export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useUser() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe
    })
};

