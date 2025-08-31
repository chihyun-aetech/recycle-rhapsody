import { AxiosRequestConfig } from 'axios';
import { BaseResponse, httpClient } from '@/shared/api';
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
} from './types';

export const statsApi = {
  // 기간별 통계 조회
  getPeriodStatistics: async (params: GetPeriodStatisticsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetPeriodStatisticsResponse>('/api/v1/statistics/period', {
      params,
      ...config,
    });
    return data;
  },

  // 일별 리포트 조회
  getDailyReports: async (params: GetDailyReportsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetDailyReportsResponse>('/api/v1/statistics/daily-reports', {
      params,
      ...config,
    });
    return data;
  },

  // 일별 리포트 수동 생성
  generateDailyReports: async (params: GenerateDailyReportsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/daily-reports/generate', null, {
      params,
      ...config,
    });
    return data;
  },

  // 시간별 리포트 조회
  getHourlyReports: async (params: GetHourlyReportsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetHourlyReportsResponse>('/api/v1/statistics/hourly-reports', {
      params,
      ...config,
    });
    return data;
  },

  // 시간별 리포트 수동 생성
  generateHourlyReports: async (params: GenerateHourlyReportsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/hourly-reports/generate', null, {
      params,
      ...config,
    });
    return data;
  },

  // 실시간 리포트 업데이트 시작
  startRealtimeUpdates: async (config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/realtime/start', null, config);
    return data;
  },

  // 오늘 통계 요약
  getTodaySummary: async (params: GetTodaySummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetTodaySummaryResponse>('/api/v1/statistics/summary/today', {
      params,
      ...config,
    });
    return data;
  },

  // 이번 주 통계 요약
  getWeekSummary: async (params: GetWeekSummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetWeekSummaryResponse>('/api/v1/statistics/summary/week', {
      params,
      ...config,
    });
    return data;
  },

  // 이번 달 통계 요약
  getMonthSummary: async (params: GetMonthSummaryParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetMonthSummaryResponse>('/api/v1/statistics/summary/month', {
      params,
      ...config,
    });
    return data;
  },

  // 캐시 상태 조회
  getCacheStatus: async (config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get('/api/v1/statistics/cache/status', config);
    return data;
  },

  // 캐시 전체 삭제
  clearCache: async (config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/cache/clear', null, config);
    return data;
  },

  // 날짜 범위별 캐시 무효화
  invalidateDateRangeCache: async (params: { start_date: string; end_date: string }, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/cache/invalidate/date-range', null, {
      params,
      ...config,
    });
    return data;
  },

  // 스테이션별 캐시 무효화
  invalidateStationCache: async (params: { station_id: string }, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<BaseResponse>('/api/v1/statistics/cache/invalidate/station', null, {
      params,
      ...config,
    });
    return data;
  },
};
