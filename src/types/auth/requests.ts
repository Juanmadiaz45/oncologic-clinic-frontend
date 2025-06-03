// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  username: string;
  password?: string;
  roleIds: number[];
}
