import { baseApi } from '@/entities/shared/config';
import type { RootResponse, HealthCheckResponse } from './types';

export const systemService = {
  // API 서버 상태 확인
  async getRoot(): Promise<RootResponse> {
    const response = await baseApi.get<RootResponse>('/');
    return response;
  },

  // 서버 헬스 체크
  async getHealth(): Promise<HealthCheckResponse> {
    const response = await baseApi.get<HealthCheckResponse>('/health');
    return response;
  },
};