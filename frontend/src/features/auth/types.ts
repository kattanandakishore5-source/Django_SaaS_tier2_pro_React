import type { User } from '../../types';

export interface LoginResponse {
  message?: string;
  user?: User;
  pending_2fa?: boolean;
  user_id?: number;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
