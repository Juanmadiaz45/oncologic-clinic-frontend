import { AuthUser } from './user';

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
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