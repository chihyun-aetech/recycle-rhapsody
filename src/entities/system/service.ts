import { httpClient } from '@/shared/api'
import type { RootResponse, HealthCheckResponse } from './types';

export const systemService = {
  // API 서버 상태 확인
  async getRoot(): Promise<RootResponse> {
    const { data } = await httpClient.get<RootResponse>('/');
    return data;
  },

  // 서버 헬스 체크
  async getHealth(): Promise<HealthCheckResponse> {
    const { data } = await httpClient.get<HealthCheckResponse>('/health');
    return data;
  },
};