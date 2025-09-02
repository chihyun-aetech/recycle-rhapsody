import { httpClient } from '@/shared/api';
import type {
  GetDailyStatsParams,
  GetDailyStatsResponse,
  GetWeeklyStatsParams,
  GetWeeklyStatsResponse,
  GetMonthlyStatsParams,
  GetMonthlyStatsResponse,
  GetYearlyStatsParams,
  GetYearlyStatsResponse,
  GetCustomPeriodStatsParams,
  GetCustomPeriodStatsResponse,
  GetStatsComparisonParams,
  GetStatsComparisonResponse,
  GetStatsTrendsParams,
  GetStatsTrendsResponse,
  GetStatsBreakdownParams,
  GetStatsBreakdownResponse,
} from './types';

export const statsService = {
  // 일간 통계 조회
  async getDailyStats(params: GetDailyStatsParams): Promise<GetDailyStatsResponse> {
    const { data } = await httpClient.get<GetDailyStatsResponse>('/api/v1/stats/daily', { params });
    return data;
  },

  // 주간 통계 조회
  async getWeeklyStats(params: GetWeeklyStatsParams): Promise<GetWeeklyStatsResponse> {
    const { data } = await httpClient.get<GetWeeklyStatsResponse>('/api/v1/stats/weekly', { params });
    return data;
  },

  // 월간 통계 조회
  async getMonthlyStats(params: GetMonthlyStatsParams): Promise<GetMonthlyStatsResponse> {
    const { data } = await httpClient.get<GetMonthlyStatsResponse>('/api/v1/stats/monthly', { params });
    return data;
  },

  // 연간 통계 조회
  async getYearlyStats(params: GetYearlyStatsParams): Promise<GetYearlyStatsResponse> {
    const { data } = await httpClient.get<GetYearlyStatsResponse>('/api/v1/stats/yearly', { params });
    return data;
  },

  // 커스텀 기간 통계 조회
  async getCustomPeriodStats(params: GetCustomPeriodStatsParams): Promise<GetCustomPeriodStatsResponse> {
    const { data } = await httpClient.get<GetCustomPeriodStatsResponse>('/api/v1/stats/custom', { params });
    return data;
  },

  // 통계 비교 조회
  async getStatsComparison(params: GetStatsComparisonParams): Promise<GetStatsComparisonResponse> {
    const { data } = await httpClient.get<GetStatsComparisonResponse>('/api/v1/stats/comparison', { params });
    return data;
  },

  // 통계 트렌드 조회
  async getStatsTrends(params: GetStatsTrendsParams): Promise<GetStatsTrendsResponse> {
    const { data } = await httpClient.get<GetStatsTrendsResponse>('/api/v1/stats/trends', { params });
    return data;
  },

  // 통계 세부 분석 조회
  async getStatsBreakdown(params: GetStatsBreakdownParams): Promise<GetStatsBreakdownResponse> {
    const { data } = await httpClient.get<GetStatsBreakdownResponse>('/api/v1/stats/breakdown', { params });
    return data;
  },
};
