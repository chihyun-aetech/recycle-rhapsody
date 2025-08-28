import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { statsApi } from './api';
import type {
  GetPeriodStatisticsParams,
  GetPeriodStatisticsResponse,
  GetDailyReportsParams,
  GetDailyReportsResponse,
  GenerateDailyReportsParams,
  GetHourlyReportsParams,
  GetHourlyReportsResponse,
  GenerateHourlyReportsParams,
  GetTodaySummaryParams,
  GetTodaySummaryResponse,
  GetWeekSummaryParams,
  GetWeekSummaryResponse,
  GetMonthSummaryParams,
  GetMonthSummaryResponse,
  BaseResponse,
} from './types';

// Query Keys
export const statsKeys = {
  all: ['stats'] as const,
  period: (params: GetPeriodStatisticsParams) => [...statsKeys.all, 'period', params] as const,
  dailyReports: (params: GetDailyReportsParams) => [...statsKeys.all, 'daily-reports', params] as const,
  hourlyReports: (params: GetHourlyReportsParams) => [...statsKeys.all, 'hourly-reports', params] as const,
  todaySummary: (params: GetTodaySummaryParams) => [...statsKeys.all, 'today-summary', params] as const,
  weekSummary: (params: GetWeekSummaryParams) => [...statsKeys.all, 'week-summary', params] as const,
  monthSummary: (params: GetMonthSummaryParams) => [...statsKeys.all, 'month-summary', params] as const,
  cacheStatus: [...statsKeys.all, 'cache-status'] as const,
};

// Queries
export const useGetPeriodStatistics = (
  params: GetPeriodStatisticsParams,
  options?: UseQueryOptions<GetPeriodStatisticsResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.period(params),
    queryFn: () => statsApi.getPeriodStatistics(params),
    ...options,
  });
};

export const useGetDailyReports = (
  params: GetDailyReportsParams,
  options?: UseQueryOptions<GetDailyReportsResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.dailyReports(params),
    queryFn: () => statsApi.getDailyReports(params),
    ...options,
  });
};

export const useGetHourlyReports = (
  params: GetHourlyReportsParams,
  options?: UseQueryOptions<GetHourlyReportsResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.hourlyReports(params),
    queryFn: () => statsApi.getHourlyReports(params),
    ...options,
  });
};

export const useGetTodaySummary = (
  params: GetTodaySummaryParams,
  options?: UseQueryOptions<GetTodaySummaryResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.todaySummary(params),
    queryFn: () => statsApi.getTodaySummary(params),
    ...options,
  });
};

export const useGetWeekSummary = (
  params: GetWeekSummaryParams,
  options?: UseQueryOptions<GetWeekSummaryResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.weekSummary(params),
    queryFn: () => statsApi.getWeekSummary(params),
    ...options,
  });
};

export const useGetMonthSummary = (
  params: GetMonthSummaryParams,
  options?: UseQueryOptions<GetMonthSummaryResponse>,
) => {
  return useQuery({
    queryKey: statsKeys.monthSummary(params),
    queryFn: () => statsApi.getMonthSummary(params),
    ...options,
  });
};

export const useGetCacheStatus = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: statsKeys.cacheStatus,
    queryFn: () => statsApi.getCacheStatus(),
    ...options,
  });
};

// Mutations
export const useGenerateDailyReports = () => {
  return useMutation({
    mutationFn: (params: GenerateDailyReportsParams) => statsApi.generateDailyReports(params),
  });
};

export const useGenerateHourlyReports = () => {
  return useMutation({
    mutationFn: (params: GenerateHourlyReportsParams) => statsApi.generateHourlyReports(params),
  });
};

export const useStartRealtimeUpdates = () => {
  return useMutation({
    mutationFn: () => statsApi.startRealtimeUpdates(),
  });
};

export const useClearCache = () => {
  return useMutation({
    mutationFn: () => statsApi.clearCache(),
  });
};

export const useInvalidateDateRangeCache = () => {
  return useMutation({
    mutationFn: (params: { start_date: string; end_date: string }) => statsApi.invalidateDateRangeCache(params),
  });
};

export const useInvalidateStationCache = () => {
  return useMutation({
    mutationFn: (params: { station_id: string }) => statsApi.invalidateStationCache(params),
  });
};
