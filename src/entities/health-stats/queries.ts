import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { healthStatsService } from './service';
import type {
  GetPeriodHealthStatisticsParams,
  GetPeriodHealthStatisticsResponse,
  GetTodayHealthSummaryParams,
  GetTodayHealthSummaryResponse,
  GetWeekHealthSummaryParams,
  GetWeekHealthSummaryResponse,
  GetMonthHealthSummaryParams,
  GetMonthHealthSummaryResponse,
  GetSystemHealthOnlyParams,
  GetSystemHealthOnlyResponse,
  GetMachineHealthOnlyParams,
  GetMachineHealthOnlyResponse,
  GetAlertsStatsOnlyParams,
  GetAlertsStatsOnlyResponse,
} from './types';

// Query Keys
export const healthStatsKeys = {
  all: ['health-stats'] as const,
  period: (params: GetPeriodHealthStatisticsParams) => [...healthStatsKeys.all, 'period', params] as const,
  todaySummary: (params: GetTodayHealthSummaryParams) => [...healthStatsKeys.all, 'today-summary', params] as const,
  weekSummary: (params: GetWeekHealthSummaryParams) => [...healthStatsKeys.all, 'week-summary', params] as const,
  monthSummary: (params: GetMonthHealthSummaryParams) => [...healthStatsKeys.all, 'month-summary', params] as const,
  systemHealth: (params: GetSystemHealthOnlyParams) => [...healthStatsKeys.all, 'system-health', params] as const,
  machineHealth: (params: GetMachineHealthOnlyParams) => [...healthStatsKeys.all, 'machine-health', params] as const,
  alertsStats: (params: GetAlertsStatsOnlyParams) => [...healthStatsKeys.all, 'alerts-stats', params] as const,
};

// Queries
export const useGetPeriodHealthStatistics = (
  params: GetPeriodHealthStatisticsParams,
  options?: UseQueryOptions<GetPeriodHealthStatisticsResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.period(params),
    queryFn: () => healthStatsService.getPeriodHealthStatistics(params),
    ...options,
  });
};

export const useGetTodayHealthSummary = (
  params: GetTodayHealthSummaryParams,
  options?: UseQueryOptions<GetTodayHealthSummaryResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.todaySummary(params),
    queryFn: () => healthStatsService.getTodayHealthSummary(params),
    ...options,
  });
};

export const useGetWeekHealthSummary = (
  params: GetWeekHealthSummaryParams,
  options?: UseQueryOptions<GetWeekHealthSummaryResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.weekSummary(params),
    queryFn: () => healthStatsService.getWeekHealthSummary(params),
    ...options,
  });
};

export const useGetMonthHealthSummary = (
  params: GetMonthHealthSummaryParams,
  options?: UseQueryOptions<GetMonthHealthSummaryResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.monthSummary(params),
    queryFn: () => healthStatsService.getMonthHealthSummary(params),
    ...options,
  });
};

export const useGetSystemHealthOnly = (
  params: GetSystemHealthOnlyParams,
  options?: UseQueryOptions<GetSystemHealthOnlyResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.systemHealth(params),
    queryFn: () => healthStatsService.getSystemHealthOnly(params),
    ...options,
  });
};

export const useGetMachineHealthOnly = (
  params: GetMachineHealthOnlyParams,
  options?: UseQueryOptions<GetMachineHealthOnlyResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.machineHealth(params),
    queryFn: () => healthStatsService.getMachineHealthOnly(params),
    ...options,
  });
};

export const useGetAlertsStatsOnly = (
  params: GetAlertsStatsOnlyParams,
  options?: UseQueryOptions<GetAlertsStatsOnlyResponse>,
) => {
  return useQuery({
    queryKey: healthStatsKeys.alertsStats(params),
    queryFn: () => healthStatsService.getAlertsStatsOnly(params),
    ...options,
  });
};

