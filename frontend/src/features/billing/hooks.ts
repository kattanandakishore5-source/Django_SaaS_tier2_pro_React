import { useQuery, useMutation } from '@tanstack/react-query';
import { getSubscriptionFn, createCheckoutSessionFn, getEntitlementsFn } from './api';
import { queryKeys } from '../../api/queryKeys';

export const useEntitlements = () => {
  return useQuery({
    queryKey: ['entitlements'],
    queryFn: getEntitlementsFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscription = () => {
  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: getSubscriptionFn,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: createCheckoutSessionFn,
  });
};
