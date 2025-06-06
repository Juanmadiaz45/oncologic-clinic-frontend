// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  loginUser,
  logoutUser,
  initializeAuth,
} from '@/store/slices/auth/actions';
import { clearError, setError, updateUser } from '@/store/slices/auth';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
  selectUserRoles,
  selectUserPermissions,
  selectHasRole,
  selectHasAnyRole,
  selectHasAllRoles,
  selectHasPermission,
  selectHasAnyPermission,
  selectHasAllPermissions,
  selectIsAdmin,
  selectIsDoctor,
  selectIsAdministrative,
  selectIsPatient,
  selectUserFullName,
  selectUserId,
  selectUsername,
} from '@/store/slices/auth/selectors';
import { LoginRequest } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Basic selectors - using optimized selectors
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isInitialized = useAppSelector(selectIsInitialized);

  // User info - using specific selectors
  const userRoles = useAppSelector(selectUserRoles);
  const userPermissions = useAppSelector(selectUserPermissions);
  const userFullName = useAppSelector(selectUserFullName);
  const userId = useAppSelector(selectUserId);
  const username = useAppSelector(selectUsername);

  // Role booleans - using memoized selectors
  const isAdmin = useAppSelector(selectIsAdmin);
  const isDoctor = useAppSelector(selectIsDoctor);
  const isAdministrative = useAppSelector(selectIsAdministrative);
  const isPatient = useAppSelector(selectIsPatient);

  // Selector functions - we create functions that use selectors
  const hasRole = useAppSelector(selectHasRole);
  const hasAnyRole = useAppSelector(selectHasAnyRole);
  const hasAllRoles = useAppSelector(selectHasAllRoles);
  const hasPermission = useAppSelector(selectHasPermission);
  const hasAnyPermission = useAppSelector(selectHasAnyPermission);
  const hasAllPermissions = useAppSelector(selectHasAllPermissions);

  // Actions
  const login = useCallback(
    async (credentials: LoginRequest) => {
      if (!credentials.username.trim() || !credentials.password.trim()) {
        dispatch(setError('Por favor ingresa usuario y contraseña'));
        return false;
      }

      try {
        await dispatch(loginUser(credentials)).unwrap();
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Utility function to update user info
  const updateUserInfo = useCallback(
    (userData: Parameters<typeof updateUser>[0]) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  return {
    // State
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,

    // User info
    userRoles,
    userPermissions,
    userFullName,
    userId,
    username,

    // Role booleans
    isAdmin,
    isDoctor,
    isAdministrative,
    isPatient,

    // Actions
    login,
    logout,
    initialize,
    clearError: clearAuthError,
    updateUser: updateUserInfo,

    // Role checking functions - Now these are the memoized functions
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Backward compatibility aliases
    getCurrentUser: () => currentUser,
    isAuth: isAuthenticated,
  };
};
