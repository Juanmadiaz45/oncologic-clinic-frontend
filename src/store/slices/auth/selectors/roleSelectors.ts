import { createSelector } from '@reduxjs/toolkit';
import { selectCurrentUser } from './authSelectors';

export const selectUserRoles = createSelector(
  [selectCurrentUser],
  user => user?.roles?.map(role => role.name) || []
);

export const selectHasRole = createSelector(
  [selectUserRoles],
  userRoles => (role: string) => userRoles.includes(role)
);

export const selectHasAnyRole = createSelector(
  [selectUserRoles],
  userRoles => (roles: string[]) => roles.some(role => userRoles.includes(role))
);

export const selectHasAllRoles = createSelector(
  [selectUserRoles],
  userRoles => (roles: string[]) =>
    roles.every(role => userRoles.includes(role))
);

export const selectIsAdmin = createSelector([selectUserRoles], userRoles =>
  userRoles.includes('ADMIN')
);

export const selectIsDoctor = createSelector([selectUserRoles], userRoles =>
  userRoles.includes('DOCTOR')
);

export const selectIsAdministrative = createSelector(
  [selectUserRoles],
  userRoles => userRoles.includes('ADMINISTRATIVE')
);

export const selectIsPatient = createSelector([selectUserRoles], userRoles =>
  userRoles.includes('PATIENT')
);
