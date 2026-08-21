

export type UserRole = "ADMIN" | "HEAD" | "DEPUTY" | "USER";


export interface UserType {
  id: string;
  username: string;
  last_name: string;
  status: UserRole;
  department_id: number | null;
}

export interface UserRegisterType {
  username: string;
  last_name: string;
  status: UserRole | null;
  department_id: number | null;
  password: string;
}

export interface UserRegisterCheckType {
  username: string;
  last_name: string;
  status: UserRole | null;
  department_id: number | null;
  password: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: number;
  username: string;
  last_name: string;
  status: UserRole;
  department_id: number | null;
}

export interface UserWithDepartment {
  id: string;
  username: string;
  last_name: string | null;
  status: string;
  department_id: string | null;  
  department_title: string | null
}

export interface LoginFormData {
  username: string;
  last_name: string;
  password: string;
}