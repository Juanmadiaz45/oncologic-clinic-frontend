// Common Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  options?: Array<{ label: string; value: string | number }>;
}