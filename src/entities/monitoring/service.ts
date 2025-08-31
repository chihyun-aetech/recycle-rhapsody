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

export const monitoringService = {
  // 객체 로그 조회
  async getObjectLogs(params: GetObjectLogsParams): Promise<GetObjectLogsResponse> {
    const { data } = await httpClient.get<GetObjectLogsResponse>('/api/v1/object-logs', { params });
    return data;
  },

  // 시스템 헬스 조회
  async getSystemHealth(params: GetSystemHealthParams): Promise<GetSystemHealthResponse> {
    const { data } = await httpClient.get<GetSystemHealthResponse>('/api/v1/system-health', { params });
    return data;
  },

  // 알람 조회
  async getAlerts(params: GetAlertsParams): Promise<GetAlertsResponse> {
    const { data } = await httpClient.get<GetAlertsResponse>('/api/v1/alerts', { params });
    return data;
  },

  // 작동 상태 조회
  async getOperationState(params: GetOperationStateParams): Promise<GetOperationStateResponse> {
    const { data } = await httpClient.get<GetOperationStateResponse>('/api/v1/operation-state', { params });
    return data;
  },

  // 머신 헬스 조회
  async getMachineHealth(params: GetMachineHealthParams): Promise<GetMachineHealthResponse> {
    const { data } = await httpClient.get<GetMachineHealthResponse>('/api/v1/machine-health', { params });
    return data;
  },
};