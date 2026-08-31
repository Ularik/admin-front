import type { UserType, UserUpdateType } from "@/types/user";
import axiosApi from "@/lib/axiosApi";


export async function adminsDeleteUser(id: string): Promise<void> {
    await axiosApi.delete(`/admin/users/${id}`);
}

export async function adminsUserUpdate({ id, data }:
     { id: string, data: UserUpdateType }): Promise<UserType> {
    const res = await axiosApi.patch(`/admin/users/${id}`, data);
    return res.data;
}