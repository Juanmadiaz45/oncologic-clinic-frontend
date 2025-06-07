import { api, setAuthToken, clearAuthToken } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, User } from '@/types';
import { ROUTES } from '@/constants';

class AuthService {
  private currentUser: User | null = null;

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
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Set current user (for app initialization)
  setCurrentUser(user: User): void {
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

  initializeFromStoredToken(): boolean {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) return false;

      return true;
    } catch (error) {
      console.error('Error initializing from token:', error);
      return false;
    }
  }
}
const authService = new AuthService();
export default authService;
