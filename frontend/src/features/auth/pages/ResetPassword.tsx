import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPasswordConfirmSchema } from '../schemas';
import type { ResetPasswordConfirmFormData } from '../schemas';
import { useConfirmPasswordReset } from '../hooks';
import type { ApiError } from '../../../types';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);
  const confirmMutation = useConfirmPasswordReset();

  const form = useForm<ResetPasswordConfirmFormData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border text-center">
          <div className="text-destructive font-semibold mb-4">Invalid Reset Link</div>
          <p className="text-muted-foreground mb-6">The password reset link is invalid or missing.</p>
          <Link to="/forgot-password" className="text-primary hover:underline">Request a new link</Link>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordConfirmFormData) => {
    confirmMutation.mutate({ ...data, token }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details) {
          Object.entries(apiError.details).forEach(([key, messages]) => {
            form.setError(key as keyof ResetPasswordConfirmFormData, { type: 'manual', message: messages[0] });
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-center">Set New Password</h1>
        
        {isSuccess ? (
          <div className="text-center">
            <div role="status" className="p-4 bg-green-100 text-green-800 rounded-md mb-6">
              Your password has been successfully reset.
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {confirmMutation.error && !(confirmMutation.error as unknown as ApiError).details && (
              <div role="alert" className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {(confirmMutation.error as unknown as ApiError).message}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">New Password</label>
              <input
                id="password"
                type="password"
                {...form.register('password')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                autoComplete="new-password"
                disabled={confirmMutation.isPending}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={confirmMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-ring focus:outline-none"
            >
              {confirmMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
