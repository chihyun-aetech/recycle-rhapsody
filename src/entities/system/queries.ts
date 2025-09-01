import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/lib/tanstack-query';
import { systemService } from './service';

// Query Hooks
export const useRoot = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SYSTEM.ROOT,
    queryFn: () => systemService.getRoot(),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useHealth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SYSTEM.HEALTH,
    queryFn: () => systemService.getHealth(),
    staleTime: 1000 * 60, // 1분
  });
};