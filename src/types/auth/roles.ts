export interface Permission {
  id: number | string;
  name: string;
}

export interface Role {
  id: number | string;
  name: string;
  permissions?: Permission[];
}
