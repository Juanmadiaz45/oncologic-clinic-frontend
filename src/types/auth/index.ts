export interface AuthUser {
  id: number | string;
  username: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
}
