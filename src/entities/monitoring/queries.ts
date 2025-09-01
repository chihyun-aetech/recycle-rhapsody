import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/lib/tanstack-query';
import { monitoringService } from './service';
import type {
  GetObjectLogsParams,
  GetSystemHealthParams,
  GetAlertsParams,
  GetOperationStateParams,
  GetMachineHealthParams,
} from './types';

// Query Hooks
export const useObjectLogs = (params: GetObjectLogsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MONITORING.OBJECT_LOGS, params],
    queryFn: () => monitoringService.getObjectLogs(params),
    staleTime: 1000 * 60, // 1분
  });
};

export const useSystemHealth = (params: GetSystemHealthParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MONITORING.SYSTEM_HEALTH, params],
    queryFn: () => monitoringService.getSystemHealth(params),
    staleTime: 1000 * 30, // 30초
  });
};

export const useAlerts = (params: GetAlertsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MONITORING.ALERTS, params],
    queryFn: () => monitoringService.getAlerts(params),
    staleTime: 1000 * 30, // 30초
  });
};

export const useOperationState = (params: GetOperationStateParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MONITORING.OPERATION_STATE, params],
    queryFn: () => monitoringService.getOperationState(params),
    staleTime: 1000 * 30, // 30초
  });
};

export const useMachineHealth = (params: GetMachineHealthParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MONITORING.MACHINE_HEALTH, params],
    queryFn: () => monitoringService.getMachineHealth(params),
    staleTime: 1000 * 30, // 30초
  });
};