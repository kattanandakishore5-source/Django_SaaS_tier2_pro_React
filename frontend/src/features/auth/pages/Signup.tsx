import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema } from '../schemas';
import type { SignupFormData } from '../schemas';
import { useSignup } from '../hooks';
import type { ApiError } from '../../../types';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard', { replace: true });
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details) {
          Object.entries(apiError.details).forEach(([key, messages]) => {
            form.setError(key as keyof SignupFormData, { type: 'manual', message: messages[0] });
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {signupMutation.error && !(signupMutation.error as unknown as ApiError).details && (
            <div role="alert" className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
              {(signupMutation.error as unknown as ApiError).message}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
              <input
                id="first_name"
                {...form.register('first_name')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                autoComplete="given-name"
                disabled={signupMutation.isPending}
              />
              {form.formState.errors.first_name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
              <input
                id="last_name"
                {...form.register('last_name')}
                className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                autoComplete="family-name"
                disabled={signupMutation.isPending}
              />
              {form.formState.errors.last_name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...form.register('email')}
              className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={signupMutation.isPending}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...form.register('password')}
              className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              autoComplete="new-password"
              disabled={signupMutation.isPending}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-ring focus:outline-none"
          >
            {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
