import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../auth/AuthContext';
import { useUpdateProfile } from '../hooks';
import { useToast } from '../../../components/ui/Toast';
import type { ApiError } from '../../../types';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast({ type: 'success', title: 'Profile updated successfully' });
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        if (apiError.details) {
          Object.entries(apiError.details).forEach(([key, messages]) => {
            form.setError(key as keyof ProfileFormData, { type: 'manual', message: messages[0] });
          });
        } else {
          toast({ type: 'error', title: 'Failed to update profile', message: apiError.message });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account's profile information and email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-2">
                <label htmlFor="first_name" className="text-sm font-medium">First Name</label>
                <Input id="first_name" {...form.register('first_name')} disabled={updateProfile.isPending} />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.first_name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
                <Input id="last_name" {...form.register('last_name')} disabled={updateProfile.isPending} />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.last_name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input id="email" type="email" {...form.register('email')} disabled={updateProfile.isPending} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Button variant="outline" disabled>
                {user?.is_2fa_enabled ? 'Enabled' : 'Enable 2FA'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
