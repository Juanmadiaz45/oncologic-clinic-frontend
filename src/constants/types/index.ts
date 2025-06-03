import { ROLES } from '../enums/roles';
import { STATUS_TYPES } from '../enums/status';
import { GENDER_TYPES } from '../enums/gender';

export type Role = typeof ROLES[keyof typeof ROLES];
export type StatusType = typeof STATUS_TYPES[keyof typeof STATUS_TYPES];
export type GenderType = typeof GENDER_TYPES[keyof typeof GENDER_TYPES];