export const DEFAULT_QUERY_OPTIONS = {
    retry: 1,
    refetchOnWindowFocus: false,
    throwOnError: false,
  } as const;
  
  export const DEFAULT_MUTATION_OPTIONS = {
    retry: 1,
    throwOnError: false,
  } as const;
  
  export const ENV_SPECIFIC_OPTIONS = {
    development: {
      queries: {
        retry: 0,
      },
    },
    production: {
      queries: {
        retry: 3,
      },
    },
  } as const;
  
  export const QUERY_CONFIG = {
    REAL_TIME: {
      staleTime: 0,
      refetchInterval: 1000,
    },
    STATIC: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
    REGULAR: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  } as const;
  

  