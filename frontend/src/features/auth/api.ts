import { apiClient } from '../../api/client';
import type { LoginResponse, SignupResponse } from './types';
import type { 
  LoginFormData, 
  SignupFormData, 
  ResetPasswordRequestFormData, 
  ResetPasswordConfirmFormData, 
  TwoFactorFormData,
  MagicLinkRequestFormData
} from './schemas';

export const loginFn = async (data: LoginFormData) => {
  const response = await apiClient.post<LoginResponse>('/api/auth/auth/login/', data);
  return response.data;
};

export const signupFn = async (data: SignupFormData) => {
  const response = await apiClient.post<SignupResponse>('/api/auth/auth/signup/', data);
  return response.data;
};

export const logoutFn = async () => {
  await apiClient.post('/api/auth/auth/logout/');
};

export const verify2FAFn = async (data: TwoFactorFormData & { user_id: number }) => {
  const response = await apiClient.post<LoginResponse>('/api/auth/auth/2fa/verify/', data);
  return response.data;
};

export const requestPasswordResetFn = async (data: ResetPasswordRequestFormData) => {
  await apiClient.post('/api/auth/auth/forgot-password/', data);
};

export const confirmPasswordResetFn = async (data: ResetPasswordConfirmFormData & { token: string }) => {
  await apiClient.post('/api/auth/auth/reset-password/', data);
};

export const requestMagicLinkFn = async (data: MagicLinkRequestFormData) => {
  await apiClient.post('/api/auth/auth/magic-link/request/', data);
};

export const verifyMagicLinkFn = async (token: string) => {
  const response = await apiClient.post<LoginResponse>('/api/auth/auth/magic-link/verify/', { token });
  return response.data;
};
