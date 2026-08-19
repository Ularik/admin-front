

export type UserRole = "ADMIN" | "HEAD" | "DEPUTY" | "USER";


export interface UserType {
  id: number;
  username: string;
  last_name: string;
  status: UserRole;
  department: number | null;
}

export interface UserRegisterType {
  username: string;
  last_name: string;
  status: UserRole | null;
  department: number | null;
  password: string;
}

export interface UserRegisterCheckType {
  username: string;
  last_name: string;
  status: UserRole | null;
  department: number | null;
  password: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: number;
  username: string;
  last_name: string;
  status: UserRole;
  department: number | null;
}

export interface UserWithDepartment {
  id: number;
  username: string;
  last_name: string | null;
  status: string;
  member_department: string | null;
  head_of_department: string | null;
  deputy_head_of_department: string | null;
}

export interface LoginFormData {
  username: string;
  last_name: string;
  password: string;
}