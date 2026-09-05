import { apiClient } from '../../api/client';
import type { PaginatedResponse, Project, DashboardStats } from '../../types';

export const getProjectsFn = async () => {
  const response = await apiClient.get<PaginatedResponse<Project> | Project[]>('/api/projects/');
  // Handle both paginated and non-paginated responses based on DRF settings
  if ('results' in response.data) {
    return response.data.results;
  }
  return response.data;
};

export const createProjectFn = async (data: { name: string; description?: string }) => {
  const response = await apiClient.post<Project>('/api/projects/', data);
  return response.data;
};

export const deleteProjectFn = async (id: number) => {
  await apiClient.delete(`/api/projects/${id}/`);
};

export const getDashboardStatsFn = async () => {
  const response = await apiClient.get<DashboardStats>('/api/dashboard/stats/');
  return response.data;
};
