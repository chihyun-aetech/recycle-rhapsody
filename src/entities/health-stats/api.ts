import { AxiosRequestConfig } from 'axios';
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

export const healthStatsApi = {
  // 기간별 헬스 통계 조회
  getPeriodHealthStatistics: async (params: GetPeriodHealthStatisticsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetPeriodHealthStatisticsResponse>('/api/v1/health-statistics/period', {
      params,
      ...config,
    });
    return data;
  },

  // 오늘 헬스 요약
  getTodayHealthSummary: async (params: GetTodayHealthSummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetTodayHealthSummaryResponse>('/api/v1/health-statistics/summary/today', {
      params,
      ...config,
    });
    return data;
  },

  // 이번 주 헬스 요약
  getWeekHealthSummary: async (params: GetWeekHealthSummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetWeekHealthSummaryResponse>('/api/v1/health-statistics/summary/week', {
      params,
      ...config,
    });
    return data;
  },

  // 이번 달 헬스 요약
  getMonthHealthSummary: async (params: GetMonthHealthSummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetMonthHealthSummaryResponse>('/api/v1/health-statistics/summary/month', {
      params,
      ...config,
    });
    return data;
  },

  // 시스템 헬스 통계만 조회
  getSystemHealthOnly: async (params: GetSystemHealthOnlyParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetSystemHealthOnlyResponse>('/api/v1/health-statistics/system-health', {
      params,
      ...config,
    });
    return data;
  },

  // 머신 헬스 통계만 조회
  getMachineHealthOnly: async (params: GetMachineHealthOnlyParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetMachineHealthOnlyResponse>('/api/v1/health-statistics/machine-health', {
      params,
      ...config,
    });
    return data;
  },

  // 알람 통계만 조회
  getAlertsStatsOnly: async (params: GetAlertsStatsOnlyParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetAlertsStatsOnlyResponse>('/api/v1/health-statistics/alerts', {
      params,
      ...config,
    });
    return data;
  },
};
