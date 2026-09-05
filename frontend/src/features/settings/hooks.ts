import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileFn } from './api';
import { useAuth } from '../auth/AuthContext';
import { queryKeys } from '../../api/queryKeys';

export const useUpdateProfile = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileFn,
    onSuccess: (updatedUser) => {
      // Update global Auth state
      login(updatedUser);
      // Invalidate just in case any other queries rely on user data
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};
