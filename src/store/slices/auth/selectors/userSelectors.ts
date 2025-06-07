import { createSelector } from '@reduxjs/toolkit';
import { selectCurrentUser } from './authSelectors';

export const selectUserFullName = createSelector(
  [selectCurrentUser],
  user => user?.username || 'Usuario'
);

export const selectUserId = createSelector(
  [selectCurrentUser],
  user => user?.id
);

export const selectUsername = createSelector(
  [selectCurrentUser],
  user => user?.username
);
