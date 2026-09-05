import { apiClient } from '../../api/client';
import type { User } from '../../types';

export const updateProfileFn = async (data: { first_name?: string; last_name?: string; email?: string }) => {
  const response = await apiClient.put<User>('/api/auth/users/profile_update/', data);
  return response.data;
};
