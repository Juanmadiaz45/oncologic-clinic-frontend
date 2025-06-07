import { createSelector } from '@reduxjs/toolkit';
import { selectCurrentUser } from './authSelectors';

export const selectUserPermissions = createSelector(
  [selectCurrentUser],
  user => {
    if (!user?.roles) return [];
    return user.roles
      .flatMap(role => role.permissions || [])
      .map(permission => permission.name);
  }
);

export const selectHasPermission = createSelector(
  [selectUserPermissions],
  userPermissions => (permission: string) =>
    userPermissions.includes(permission)
);

export const selectHasAnyPermission = createSelector(
  [selectUserPermissions],
  userPermissions => (permissions: string[]) =>
    permissions.some(permission => userPermissions.includes(permission))
);

export const selectHasAllPermissions = createSelector(
  [selectUserPermissions],
  userPermissions => (permissions: string[]) =>
    permissions.every(permission => userPermissions.includes(permission))
);
