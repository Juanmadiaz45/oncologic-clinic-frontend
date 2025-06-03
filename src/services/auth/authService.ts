import { api, setAuthToken, clearAuthToken } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, AuthUser } from '@/types';
import { ROUTES } from '@/constants';

interface JWTPayload {
  sub: string;
  username?: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Utility to decode JWT (without verification - only for client-side info)
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

class AuthService {
  private currentUser: AuthUser | null = null;

  // Login user
  async login(credentials: LoginRequest): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    // Set token in API client
    setAuthToken(response.accessToken);

    // Decode JWT to get user info
    const decodedToken = decodeJWT(response.accessToken);

    if (decodedToken) {
      // Extract user info from token
      // Tu JWT tiene: username, roles, sub, iat, exp
      const rawRoles = decodedToken.roles || [];

      // Normalizar roles (quitar prefijo ROLE_ si existe)
      const normalizedRoles = rawRoles.map((role: string) =>
        role.startsWith('ROLE_') ? role.substring(5) : role
      );

      this.currentUser = {
        id: decodedToken.sub,
        username: decodedToken.username || decodedToken.sub,
        roles: normalizedRoles,
      };
    }

    return response;
  }

  // Alternative: Get user info from a separate endpoint after login
  async getUserInfo(): Promise<AuthUser | null> {
    try {
      // Si tienes un endpoint para obtener info del usuario actual
      const userInfo = await api.get<AuthUser>('/auth/me');
      this.currentUser = userInfo;
      return userInfo;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  // Logout user
  logout(): void {
    clearAuthToken();
    this.currentUser = null;
    window.location.href = ROUTES.LOGIN;
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Set current user (for app initialization)
  setCurrentUser(user: AuthUser): void {
    this.currentUser = user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.currentUser?.roles.includes(role) ?? false;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Check if user has all specified roles
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  // Role-specific checks
  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('ROLE_ADMIN');
  }

  isDoctor(): boolean {
    return this.hasRole('DOCTOR') || this.hasRole('ROLE_DOCTOR');
  }

  isAdministrative(): boolean {
    return (
      this.hasRole('ADMINISTRATIVE') || this.hasRole('ROLE_ADMINISTRATIVE')
    );
  }

  isPatient(): boolean {
    return this.hasRole('PATIENT') || this.hasRole('ROLE_PATIENT');
  }

  // Initialize auth state from stored token
  initializeFromStoredToken(): boolean {
    try {
      // Lookup token in localStorage or sessionStorage
      const storedToken =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

      if (!storedToken) return false;

      // Check if the token has not expired
      const decodedToken = decodeJWT(storedToken);
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }

      // Restore state
      setAuthToken(storedToken);

      const rawRoles = decodedToken.roles || [];
      const normalizedRoles = rawRoles.map((role: string) =>
        role.startsWith('ROLE_') ? role.substring(5) : role
      );

      this.currentUser = {
        id: decodedToken.sub,
        username: decodedToken.username || decodedToken.sub,
        roles: normalizedRoles,
      };

      return true;
    } catch (error) {
      this.logout();
      return error instanceof Error ? false : true;
    }
  }

  // Store token persistently
  storeToken(token: string, persistent: boolean = false): void {
    if (persistent) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  }

  // Clear stored token
  clearStoredToken(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  // Get user permissions based on roles
  getPermissions(): string[] {
    if (!this.currentUser) return [];

    const permissions: string[] = [];

    if (this.isAdmin()) {
      permissions.push(
        'users:read',
        'users:create',
        'users:update',
        'users:delete',
        'patients:read',
        'patients:create',
        'patients:update',
        'patients:delete',
        'doctors:read',
        'doctors:create',
        'doctors:update',
        'doctors:delete',
        'appointments:read',
        'appointments:create',
        'appointments:update',
        'appointments:delete',
        'laboratory:read',
        'laboratory:create',
        'laboratory:update',
        'laboratory:delete',
        'administration:read',
        'administration:create',
        'administration:update',
        'administration:delete'
      );
    }

    if (this.isDoctor()) {
      permissions.push(
        'patients:read',
        'patients:update',
        'appointments:read',
        'appointments:create',
        'appointments:update',
        'medical-history:read',
        'medical-history:create',
        'medical-history:update',
        'treatments:read',
        'treatments:create',
        'treatments:update',
        'laboratory:read',
        'laboratory:create'
      );
    }

    if (this.isAdministrative()) {
      permissions.push(
        'patients:read',
        'patients:create',
        'patients:update',
        'appointments:read',
        'appointments:create',
        'appointments:update',
        'doctors:read',
        'laboratory:read'
      );
    }

    if (this.isPatient()) {
      permissions.push(
        'own-data:read',
        'own-appointments:read',
        'own-medical-history:read',
        'own-results:read'
      );
    }

    return [...new Set(permissions)];
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }
}

const authService = new AuthService();
export default authService;
