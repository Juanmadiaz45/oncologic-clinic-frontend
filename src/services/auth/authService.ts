import { api, setAuthToken, clearAuthToken } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, AuthUser } from '@/types';
import { ROUTES } from '@/constants';

class AuthService {
  private currentUser: AuthUser | null = null;

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    // Set token in API client
    setAuthToken(response.accessToken);

    this.setCurrentUser(response.user);

    return response;
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
}
const authService = new AuthService();
export default authService;
