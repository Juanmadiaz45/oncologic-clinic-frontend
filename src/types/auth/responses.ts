import { User } from './user';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface PermissionResponseDTO {
  id: number;
  name: string;
}

export interface RoleResponseDTO {
  id: number;
  name: string;
  permissions: PermissionResponseDTO[];
}

export interface UserResponseDTO {
  id: number;
  username: string;
  roles: RoleResponseDTO[];
}