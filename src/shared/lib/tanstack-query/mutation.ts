import { ApiResponse } from '@/shared/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface CommonMutationOptions<TData, TVariables>
  extends Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'> {
  onSuccessMessage?: string;
}

export function useCommonMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: CommonMutationOptions<TData, TVariables>
) {
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn,
    retry: 1,
    ...options,
  });
}
