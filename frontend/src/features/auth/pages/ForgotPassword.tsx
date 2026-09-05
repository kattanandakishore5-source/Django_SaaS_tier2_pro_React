import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { resetPasswordRequestSchema } from '../schemas';
import type { ResetPasswordRequestFormData } from '../schemas';
import { useRequestPasswordReset } from '../hooks';
import type { ApiError } from '../../../types';

export const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const resetMutation = useRequestPasswordReset();

  const form = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
  });

  const onSubmit = (data: ResetPasswordRequestFormData) => {
    resetMutation.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details) {
          Object.entries(apiError.details).forEach(([key, messages]) => {
            form.setError(key as keyof ResetPasswordRequestFormData, { type: 'manual', message: messages[0] });
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        {isSuccess ? (
          <div className="text-center">
            <div role="status" className="p-4 bg-primary/10 text-primary rounded-md mb-6">
              If an account exists for that email, we have sent a reset link.
            </div>
            <Link to="/login" className="text-primary hover:underline">Return to sign in</Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {resetMutation.error && !(resetMutation.error as unknown as ApiError).details && (
              <div role="alert" className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {(resetMutation.error as unknown as ApiError).message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                {...form.register('email')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={resetMutation.isPending}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-ring focus:outline-none"
            >
              {resetMutation.isPending ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
