import { httpClient } from '@/shared/api';
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

export const healthStatsService = {
  // 기간별 헬스 통계 조회
  async getPeriodHealthStatistics(params: GetPeriodHealthStatisticsParams): Promise<GetPeriodHealthStatisticsResponse> {
    const { data } = await httpClient.get<GetPeriodHealthStatisticsResponse>('/api/v1/health-statistics/period', { params });
    return data;
  },

  // 오늘 헬스 요약
  async getTodayHealthSummary(params: GetTodayHealthSummaryParams): Promise<GetTodayHealthSummaryResponse> {
    const { data } = await httpClient.get<GetTodayHealthSummaryResponse>('/api/v1/health-statistics/summary/today', { params });
    return data;
  },

  // 이번 주 헬스 요약
  async getWeekHealthSummary(params: GetWeekHealthSummaryParams): Promise<GetWeekHealthSummaryResponse> {
    const { data } = await httpClient.get<GetWeekHealthSummaryResponse>('/api/v1/health-statistics/summary/week', { params });
    return data;
  },

  // 이번 달 헬스 요약
  async getMonthHealthSummary(params: GetMonthHealthSummaryParams): Promise<GetMonthHealthSummaryResponse> {
    const { data } = await httpClient.get<GetMonthHealthSummaryResponse>('/api/v1/health-statistics/summary/month', { params });
    return data;
  },

  // 시스템 헬스 통계만 조회
  async getSystemHealthOnly(params: GetSystemHealthOnlyParams): Promise<GetSystemHealthOnlyResponse> {
    const { data } = await httpClient.get<GetSystemHealthOnlyResponse>('/api/v1/health-statistics/system-health', { params });
    return data;
  },

  // 머신 헬스 통계만 조회
  async getMachineHealthOnly(params: GetMachineHealthOnlyParams): Promise<GetMachineHealthOnlyResponse> {
    const { data } = await httpClient.get<GetMachineHealthOnlyResponse>('/api/v1/health-statistics/machine-health', { params });
    return data;
  },

  // 알람 통계만 조회
  async getAlertsStatsOnly(params: GetAlertsStatsOnlyParams): Promise<GetAlertsStatsOnlyResponse> {
    const { data } = await httpClient.get<GetAlertsStatsOnlyResponse>('/api/v1/health-statistics/alerts', { params });
    return data;
  },
};
