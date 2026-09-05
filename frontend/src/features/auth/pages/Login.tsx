import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { LoginFormData, TwoFactorFormData } from '../schemas';
import { loginSchema, twoFactorSchema } from '../schemas';
import { useLogin, useVerify2FA } from '../hooks';
import type { ApiError } from '../../../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const [pending2FAUserId, setPending2FAUserId] = useState<number | null>(null);

  const loginMutation = useLogin();
  const verify2FAMutation = useVerify2FA();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const twoFactorForm = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        if (res.pending_2fa && res.user_id) {
          setPending2FAUserId(res.user_id);
        } else {
          navigate(from, { replace: true });
        }
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details) {
          Object.entries(apiError.details).forEach(([key, messages]) => {
            loginForm.setError(key as keyof LoginFormData, { type: 'manual', message: messages[0] });
          });
        }
      }
    });
  };

  const on2FASubmit = (data: TwoFactorFormData) => {
    if (!pending2FAUserId) return;
    verify2FAMutation.mutate({ ...data, user_id: pending2FAUserId }, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details?.code) {
          twoFactorForm.setError('code', { type: 'manual', message: apiError.details.code[0] });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {pending2FAUserId ? 'Two-Factor Authentication' : 'Welcome Back'}
        </h1>
        
        {!pending2FAUserId ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" noValidate>
            {loginMutation.error && !((loginMutation.error as unknown as ApiError).details?.email) && (
              <div role="alert" className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {(loginMutation.error as unknown as ApiError).message}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                {...loginForm.register('email')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="you@example.com"
                disabled={loginMutation.isPending}
                autoComplete="email"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                {...loginForm.register('password')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                disabled={loginMutation.isPending}
                autoComplete="current-password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-ring focus:outline-none"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={twoFactorForm.handleSubmit(on2FASubmit)} className="space-y-4" noValidate>
            {verify2FAMutation.error && !((verify2FAMutation.error as unknown as ApiError).details?.code) && (
              <div role="alert" className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {(verify2FAMutation.error as unknown as ApiError).message}
              </div>
            )}
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">6-digit Code</label>
              <input
                id="code"
                {...twoFactorForm.register('code')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="123456"
                autoComplete="one-time-code"
                inputMode="numeric"
                disabled={verify2FAMutation.isPending}
              />
              {twoFactorForm.formState.errors.code && (
                <p className="text-sm text-destructive mt-1">{twoFactorForm.formState.errors.code.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={verify2FAMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {verify2FAMutation.isPending ? 'Verifying...' : 'Verify'}
            </button>
            
            <button
              type="button"
              onClick={() => setPending2FAUserId(null)}
              className="w-full bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
