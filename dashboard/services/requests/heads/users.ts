import type { UserType, UserUpdateType } from "@/types/user";
import axiosApi from "@/lib/axiosApi";


export async function headsDeleteUser(id: string): Promise<void> {
    await axiosApi.delete(`/head/users/${id}`);
}

export async function headsUserUpdate({ id, data }:
     { id: string, data: UserUpdateType }): Promise<UserType> {
    const res = await axiosApi.patch(`/head/users/${id}`, data);
    return res.data;
}