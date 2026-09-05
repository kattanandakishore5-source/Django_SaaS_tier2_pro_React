import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSubscription, useCheckout } from '../features/billing/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Billing Hooks', () => {
  it('useSubscription fetches successfully', async () => {
    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.has_active_subscription).toBe(false);
  });

  it('useCheckout mutation works', async () => {
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('pro');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.checkout_url).toBe('https://checkout.stripe.com/mock-session');
  });
});
