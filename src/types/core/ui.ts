export interface TableColumn<T = unknown> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
  width?: string | number;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T) => void;
  className?: string;
}


// Toast/Notification Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}