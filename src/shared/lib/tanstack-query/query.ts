import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponse } from '@/shared/api';

const defaultOptions = {
  retry: 1,
  gcTime: 0,
  staleTime: 60 * 1000,
};

export type CommonQueryOptions<TData, TError> = Omit<
  UseQueryOptions<ApiResponse<TData>, TError, ApiResponse<TData>, QueryKey>,
  'queryKey' | 'queryFn'
>;

export function useCommonQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: CommonQueryOptions<TData, Error>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...defaultOptions,
    ...options,
  });
}
