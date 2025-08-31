import { AxiosRequestConfig } from 'axios';
import { httpClient } from '@/shared/api';
import type {
  GetObjectLogsParams,
  GetObjectLogsResponse,
  GetSystemHealthParams,
  GetSystemHealthResponse,
  GetAlertsParams,
  GetAlertsResponse,
  GetOperationStateParams,
  GetOperationStateResponse,
  GetMachineHealthParams,
  GetMachineHealthResponse,
} from './types';

export const monitoringApi = {
  // 객체 로그 조회
  getObjectLogs: async (params: GetObjectLogsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetObjectLogsResponse>('/api/v1/object-logs', {
      params,
      ...config,
    });
    return data;
  },

  // 시스템 헬스 조회
  getSystemHealth: async (params: GetSystemHealthParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetSystemHealthResponse>('/api/v1/system-health', {
      params,
      ...config,
    });
    return data;
  },

  // 알람 조회
  getAlerts: async (params: GetAlertsParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetAlertsResponse>('/api/v1/alerts', {
      params,
      ...config,
    });
    return data;
  },

  // 작동 상태 조회
  getOperationState: async (params: GetOperationStateParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetOperationStateResponse>('/api/v1/operation-state', {
      params,
      ...config,
    });
    return data;
  },

  // 머신 헬스 조회
  getMachineHealth: async (params: GetMachineHealthParams, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<GetMachineHealthResponse>('/api/v1/machine-health', {
      params,
      ...config,
    });
    return data;
  },
};