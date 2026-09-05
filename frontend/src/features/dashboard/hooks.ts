import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsFn, createProjectFn, deleteProjectFn, getDashboardStatsFn } from './api';
import { queryKeys } from '../../api/queryKeys';
import type { ApiError } from '../../types';

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjectsFn,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: getDashboardStatsFn,
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError & { status?: number };
      if (apiError.status === 403) return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
  });
};
