import { apiClient } from '../../api/client';
import type { SubscriptionResponse, CheckoutResponse, EntitlementsResponse } from '../../types';

export const getSubscriptionFn = async () => {
  const response = await apiClient.get<SubscriptionResponse>('/billing/api/billing/subscription/');
  return response.data;
};

export const createCheckoutSessionFn = async (planId: string) => {
  const response = await apiClient.post<CheckoutResponse>('/billing/api/billing/checkout/', { plan_id: planId });
  return response.data;
};

export const getEntitlementsFn = async () => {
  const response = await apiClient.get<EntitlementsResponse>('/billing/api/billing/entitlements/');
  return response.data;
};
