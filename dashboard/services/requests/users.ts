import axiosApi from "../axiosApi";
import type { UserType, UserRegisterType, UserResponse } from "@/types/user";



export async function registerUser(body: UserRegisterType): Promise<UserResponse> {
  const { data } = await axiosApi.post<UserResponse>("/users/", body);
  return data;
}

export async function getMe(): Promise<UserType> {
    const res = await axiosApi.get("users/me");
    return res.data;
}