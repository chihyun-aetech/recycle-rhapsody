import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/lib/tanstack-query';
import { operationStatsService } from './service';
import type {
  GetOperationStatsParams,
  GetOperationSummaryParams,
  GetOperationHistoryParams,
  GetOperationTrendsParams,
  GetOperationAlertsParams,
  GetOperationPerformanceParams,
} from './types';

// Query Hooks
export const useOperationStats = (params: GetOperationStatsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.STATS, params],
    queryFn: () => operationStatsService.getOperationStats(params),
    staleTime: 1000 * 60, // 1분
  });
};

export const useOperationSummary = (params: GetOperationSummaryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.SUMMARY, params],
    queryFn: () => operationStatsService.getOperationSummary(params),
    staleTime: 1000 * 60, // 1분
  });
};

export const useOperationHistory = (params: GetOperationHistoryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.HISTORY, params],
    queryFn: () => operationStatsService.getOperationHistory(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useOperationTrends = (params: GetOperationTrendsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.TRENDS, params],
    queryFn: () => operationStatsService.getOperationTrends(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useOperationAlerts = (params: GetOperationAlertsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.ALERTS, params],
    queryFn: () => operationStatsService.getOperationAlerts(params),
    staleTime: 1000 * 30, // 30초
  });
};

export const useOperationPerformance = (params: GetOperationPerformanceParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.OPERATION_STATS.PERFORMANCE, params],
    queryFn: () => operationStatsService.getOperationPerformance(params),
    staleTime: 1000 * 60, // 1분
  });
};
