import { QueryClient } from '@tanstack/react-query';
import { DEFAULT_MUTATION_OPTIONS, DEFAULT_QUERY_OPTIONS, ENV_SPECIFIC_OPTIONS } from './config';

const envOptions = ENV_SPECIFIC_OPTIONS[process.env.NODE_ENV as keyof typeof ENV_SPECIFIC_OPTIONS] || {};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...DEFAULT_QUERY_OPTIONS,
        ...envOptions.queries,
      },
      mutations: {
        ...DEFAULT_MUTATION_OPTIONS,
      },
    },
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
      onError: error => {
        console.error('Mutation error:', error);
      },
    },
  },
});
