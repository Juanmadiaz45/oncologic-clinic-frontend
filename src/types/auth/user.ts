import { BaseEntity } from '../core/api';

// User Types
export interface User extends BaseEntity {
  username: string;
  roles: UserRole[];
}

export interface UserRole {
  id: number;
  role: {
    id: number;
    name: string;
    description?: string;
  };
}
