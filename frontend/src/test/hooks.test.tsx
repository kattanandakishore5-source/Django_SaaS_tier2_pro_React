import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProjects, useDashboardStats } from '../features/dashboard/hooks';
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

describe('Dashboard Hooks', () => {
  it('useProjects fetches successfully', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(1);
    expect(result.current.data?.[0].name).toBe('Test Project');
  });

  it('useDashboardStats gracefully degrades on 403', async () => {
    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    // MSW will return 403, and our hook disables retries for 403
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    // We expect the query to be in error state but not crash
    expect(result.current.error).toBeDefined();
    const error: any = result.current.error;
    expect(error.status).toBe(403);
  });
});
