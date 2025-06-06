import { api, setAuthToken, clearAuthToken } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, AuthUser } from '@/types';
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

  constructor() {
    this.initializeFromStoredToken();
  }

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    this.storeToken(response.accessToken, true);
    
    // Set token in API client
    setAuthToken(response.accessToken);

    if (response.user) {
      this.setCurrentUser(response.user);
    } else {
      const decodedToken = decodeJWT(response.accessToken);
      if (decodedToken) {
        const rawRoles = decodedToken.roles || [];
        const normalizedRoles = rawRoles.map((role: string) =>
          role.startsWith('ROLE_') ? role.substring(5) : role
        );

        this.currentUser = {
          id: decodedToken.sub,
          username: decodedToken.username || decodedToken.sub,
          roles: normalizedRoles,
        };
      }
    }

    return response;
  }

  initializeFromStoredToken(): boolean {
    try {
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      if (!storedToken) {
        return false;
      }

      const decodedToken = decodeJWT(storedToken);
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        console.log('Token expirado, limpiando...');
        this.clearStoredToken();
        return false;
      }

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

      console.log('Usuario restaurado desde token:', this.currentUser);
      return true;
    } catch (error) {
      console.error('Error inicializando desde token:', error);
      this.clearStoredToken();
      return false;
    }
  }

  // Logout user
  logout(): void {
    clearAuthToken();
    this.currentUser = null;
    this.clearStoredToken();
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
    return this.hasRole('ADMINISTRATIVE') || this.hasRole('ROLE_ADMINISTRATIVE');
  }

  isPatient(): boolean {
    return this.hasRole('PATIENT') || this.hasRole('ROLE_PATIENT');
  }

  // Store token persistently
  storeToken(token: string, persistent: boolean = false): void {
    if (persistent) {
      localStorage.setItem('auth_token', token);
      sessionStorage.removeItem('auth_token');
    } else {
      sessionStorage.setItem('auth_token', token);
      localStorage.removeItem('auth_token');
    }
  }

  // Clear stored token
  clearStoredToken(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  // Check if token is valid (not expired)
  isTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    const decodedToken = decodeJWT(token);
    return decodedToken ? decodedToken.exp * 1000 > Date.now() : false;
  }

  // Force refresh authentication state
  refreshAuthState(): boolean {
    return this.initializeFromStoredToken();
  }
}

const authService = new AuthService();
export default authService;
