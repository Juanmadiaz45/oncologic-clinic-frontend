import { Role } from './roles';

export interface User {
  id: number | string;
  username: string;
  roles: Role[];
}
