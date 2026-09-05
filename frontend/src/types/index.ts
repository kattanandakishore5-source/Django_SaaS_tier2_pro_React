// User Profile
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  phone_number: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Billing / Subscription
export interface Subscription {
  id: string | null;
  status: string;
  price_id: string | null;
  cancel_at_period_end: boolean;
}

export interface SubscriptionStatus {
  has_active_subscription: boolean;
  subscription: Subscription | null;
}

// Dashboard Analytics (Admin Only)
export interface DashboardStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  registrations_30d: number;
}

export interface SignupChartData {
  labels: string[];
  data: number[];
}

// Core Business Resources
export interface Project {
  id: number;
  name: string;
  description: string | null;
  user: number;
  created_at: string;
  updated_at: string;
}

// API Error Shape
export interface ApiError {
  message: string;
  details: Record<string, string[]> | null;
  status?: number;
}
