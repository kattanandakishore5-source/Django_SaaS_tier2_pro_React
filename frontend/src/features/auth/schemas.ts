import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ResetPasswordRequestFormData = z.infer<typeof resetPasswordRequestSchema>;

export const resetPasswordConfirmSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ResetPasswordConfirmFormData = z.infer<typeof resetPasswordConfirmSchema>;

export const twoFactorSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export const magicLinkRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type MagicLinkRequestFormData = z.infer<typeof magicLinkRequestSchema>;
