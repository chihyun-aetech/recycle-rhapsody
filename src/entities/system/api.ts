import { AxiosRequestConfig } from 'axios';
import { httpClient } from '@/shared/api';

export const systemApi = {
  // API 서버 상태 확인
  getRoot: async (config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get('/', config);
    return data;
  },

  // 서버 헬스 체크
  healthCheck: async (config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get('/health', config);
    return data;
  },
};