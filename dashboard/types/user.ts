

export type UserRole = "ADMIN" | "HEAD" | "USER";


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

export interface LoginFormData {
  username: string;
  last_name: string;
  password: string;
}