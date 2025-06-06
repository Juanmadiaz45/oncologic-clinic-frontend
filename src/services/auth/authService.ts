// src/services/auth/authService.ts
import { api, setAuthToken, clearAuthToken } from '@/services/api/client';
// import { API_ENDPOINTS } from '@/constants';

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

interface AuthUser {
  id: string;
  username: string;
  roles: string[];
}

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
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      // Set token in API client
      setAuthToken(response.accessToken);

      // Store token persistently
      localStorage.setItem('auth_token', response.accessToken);

      // Decode JWT to get user info
      const decodedToken = decodeJWT(response.accessToken);

      if (decodedToken) {
        // Extract user info from token
        const rawRoles = decodedToken.roles || [];
        
        console.log('Raw roles from token:', rawRoles); // Para debug
        
        // Los roles vienen como ["ROLE_DOCTOR"] o ["ROLE_ADMIN"], etc.
        // Los normalizamos quitando el prefijo ROLE_ para facilitar el manejo
        const normalizedRoles = rawRoles.map((role: string) =>
          role.startsWith('ROLE_') ? role.substring(5) : role
        );

        console.log('Normalized roles:', normalizedRoles); // Para debug

        this.currentUser = {
          id: decodedToken.sub,
          username: decodedToken.username || decodedToken.sub,
          roles: normalizedRoles, // Roles sin el prefijo ROLE_
        };

        console.log('Current user set:', this.currentUser); // Para debug
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Credenciales inválidas');
    }
  }

  // Logout user
  logout(): void {
    clearAuthToken();
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
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
    if (!this.currentUser) return false;
    
    // Normalizar el rol de entrada (quitar ROLE_ si lo tiene)
    const normalizedRole = role.startsWith('ROLE_') ? role.substring(5) : role;
    
    console.log('Checking role:', normalizedRole, 'against user roles:', this.currentUser.roles); // Para debug
    
    return this.currentUser.roles.includes(normalizedRole);
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    if (!this.currentUser) return false;
    
    // Normalizar todos los roles
    const normalizedRoles = roles.map(role => 
      role.startsWith('ROLE_') ? role.substring(5) : role
    );
    
    console.log('Checking any of roles:', normalizedRoles, 'against user roles:', this.currentUser.roles); // Para debug
    
    return normalizedRoles.some(role => this.currentUser!.roles.includes(role));
  }

  // Check if user has all specified roles
  hasAllRoles(roles: string[]): boolean {
    if (!this.currentUser) return false;
    
    // Normalizar todos los roles
    const normalizedRoles = roles.map(role => 
      role.startsWith('ROLE_') ? role.substring(5) : role
    );
    
    return normalizedRoles.every(role => this.currentUser!.roles.includes(role));
  }

  // Role-specific checks
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isDoctor(): boolean {
    return this.hasRole('DOCTOR');
  }

  isAdministrative(): boolean {
    return this.hasRole('ADMINISTRATIVE');
  }

  isPatient(): boolean {
    return this.hasRole('PATIENT');
  }

  // Initialize auth state from stored token
  initializeFromStoredToken(): boolean {
    try {
      const storedToken = localStorage.getItem('auth_token');

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

      console.log('Initialized user from token:', this.currentUser); // Para debug

      return true;
    } catch (error) {
      console.error('Error initializing from token:', error);
      this.logout();
      return false;
    }
  }

  // Get user permissions based on roles
  getPermissions(): string[] {
    if (!this.currentUser) return [];

    const permissions: string[] = [];

    if (this.isAdmin()) {
      permissions.push(
        'users:read', 'users:create', 'users:update', 'users:delete',
        'patients:read', 'patients:create', 'patients:update', 'patients:delete',
        'doctors:read', 'doctors:create', 'doctors:update', 'doctors:delete',
        'appointments:read', 'appointments:create', 'appointments:update', 'appointments:delete',
        'laboratory:read', 'laboratory:create', 'laboratory:update', 'laboratory:delete',
        'administration:read', 'administration:create', 'administration:update', 'administration:delete'
      );
    }

    if (this.isDoctor()) {
      permissions.push(
        'patients:read', 'patients:update',
        'appointments:read', 'appointments:create', 'appointments:update',
        'medical-history:read', 'medical-history:create', 'medical-history:update',
        'treatments:read', 'treatments:create', 'treatments:update',
        'laboratory:read', 'laboratory:create'
      );
    }

    if (this.isAdministrative()) {
      permissions.push(
        'patients:read', 'patients:create', 'patients:update',
        'appointments:read', 'appointments:create', 'appointments:update',
        'doctors:read', 'laboratory:read'
      );
    }

    if (this.isPatient()) {
      permissions.push(
        'own-data:read', 'own-appointments:read',
        'own-medical-history:read', 'own-results:read'
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