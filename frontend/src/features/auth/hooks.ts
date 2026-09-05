import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  loginFn, 
  signupFn, 
  logoutFn, 
  verify2FAFn, 
  requestPasswordResetFn, 
  confirmPasswordResetFn,
  requestMagicLinkFn,
  verifyMagicLinkFn
} from './api';
import { useAuth } from './AuthContext';

export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      // If pending_2fa is true, we don't log them in yet, we let the UI handle the transition
      if (!data.pending_2fa && data.user) {
        login(data.user);
        queryClient.invalidateQueries();
      }
    },
  });
};

export const useSignup = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupFn,
    onSuccess: (data) => {
      login(data.user);
      queryClient.invalidateQueries();
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutFn,
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useVerify2FA = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verify2FAFn,
    onSuccess: (data) => {
      if (data.user) {
        login(data.user);
        queryClient.invalidateQueries();
      }
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({ mutationFn: requestPasswordResetFn });
};

export const useConfirmPasswordReset = () => {
  return useMutation({ mutationFn: confirmPasswordResetFn });
};

export const useRequestMagicLink = () => {
  return useMutation({ mutationFn: requestMagicLinkFn });
};

export const useVerifyMagicLink = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyMagicLinkFn,
    onSuccess: (data) => {
      if (!data.pending_2fa && data.user) {
        login(data.user);
        queryClient.invalidateQueries();
      }
    },
  });
};
