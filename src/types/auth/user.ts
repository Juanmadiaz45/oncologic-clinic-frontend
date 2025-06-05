import { Role } from './roles';

export interface AuthUser {
  id: number | string;
  username: string;
  roles: Role[];
}
