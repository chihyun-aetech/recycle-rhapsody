import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ipAccessService } from './service';
import type {
  IpAccessCreate,
  IpAccessUpdate,
  IpAccessFilters,
  IpAccessResponse,
  IpAccessListResponse,
  IpAccessStats,
} from './types';
import { BaseResponse } from '../../shared/api/types';
import {
  calculateLocationStats,
  calculateDeviceStats,
  getTopItems,
  checkLocationSuspicion,
  checkRapidAccessSuspicion,
  validateIpAddress,
} from '@/shared/lib/utils';

// Query Keys
export const ipAccessKeys = {
  all: ['ip-access'] as const,
  lists: () => [...ipAccessKeys.all, 'list'] as const,
  list: (filters: IpAccessFilters) => [...ipAccessKeys.lists(), filters] as const,
  details: () => [...ipAccessKeys.all, 'detail'] as const,
  detail: (id: string) => [...ipAccessKeys.details(), id] as const,
  userAccess: (userId: string, page?: number, limit?: number) => 
    [...ipAccessKeys.all, 'user', userId, page, limit] as const,
  stats: () => [...ipAccessKeys.all, 'stats'] as const,
};

// Base Queries
export const useIpAccessLogs = (
  filters?: IpAccessFilters,
  options?: UseQueryOptions<IpAccessListResponse>
) => {
  return useQuery<IpAccessListResponse>({
    queryKey: ipAccessKeys.list(filters || {}),
    queryFn: () => ipAccessService.getIpAccessLogs(filters),
    ...options,
  });
};

export const useIpAccessById = (
  accessId: string,
  options?: UseQueryOptions<IpAccessResponse>
) => {
  return useQuery<IpAccessResponse>({
    queryKey: ipAccessKeys.detail(accessId),
    queryFn: () => ipAccessService.getIpAccessById(accessId),
    ...options,
  });
};

export const useUserIpAccess = (
  userId: string,
  page = 1,
  limit = 50,
  options?: UseQueryOptions<IpAccessListResponse>
) => {
  return useQuery<IpAccessListResponse>({
    queryKey: ipAccessKeys.userAccess(userId, page, limit),
    queryFn: () => ipAccessService.getUserIpAccess(userId, page, limit),
    ...options,
  });
};

// Mutations
export const useCreateIpAccess = (
  options?: UseMutationOptions<IpAccessResponse, Error, IpAccessCreate>
) => {
  return useMutation({
    mutationFn: (data: IpAccessCreate) => {
      // Validation
      if (!data.user_id?.trim()) {
        throw new Error('User ID is required');
      }
      if (!data.address?.trim()) {
        throw new Error('IP address is required');
      }
      if (!validateIpAddress(data.address)) {
        throw new Error('Invalid IP address format');
      }
      
      return ipAccessService.createIpAccess(data);
    },
    ...options,
  });
};

export const useUpdateIpAccess = (
  options?: UseMutationOptions<IpAccessResponse, Error, { id: string; data: IpAccessUpdate }>
) => {
  return useMutation({
    mutationFn: ({ id, data }) => ipAccessService.updateIpAccess(id, data),
    ...options,
  });
};

export const useDeleteIpAccess = (
  options?: UseMutationOptions<BaseResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (id: string) => ipAccessService.deleteIpAccess(id),
    ...options,
  });
};

export const useDeleteUserIpAccess = (
  options?: UseMutationOptions<BaseResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (userId: string) => ipAccessService.deleteUserIpAccess(userId),
    ...options,
  });
};

// Advanced Queries
export const useIpAccessStats = (limit = 1000) => {
  const { data: logs = { data: [] } } = useIpAccessLogs({ limit });

  return useMemo(() => {
    const accessLogs = logs?.data || [];
    
    const uniqueIps = new Set(accessLogs.map(log => log.address));
    const uniqueUsers = new Set(accessLogs.map(log => log.user_id));
    
    const locationCounts = calculateLocationStats(accessLogs);
    const deviceCounts = calculateDeviceStats(accessLogs);

    const topLocations = getTopItems(
      Object.entries(locationCounts).map(([location, count]) => ({ location, count })),
      10
    );

    const topDevices = getTopItems(
      Object.entries(deviceCounts).map(([device, count]) => ({ device, count })),
      10
    );

    const stats: IpAccessStats = {
      total_accesses: accessLogs.length,
      unique_ips: uniqueIps.size,
      unique_users: uniqueUsers.size,
      top_locations: topLocations,
      top_devices: topDevices,
      recent_accesses: accessLogs.slice(0, 10),
    };

    return stats;
  }, [logs]);
};

export const useDetectSuspiciousActivity = (ipAddress?: string, userId?: string) => {
  const filters: IpAccessFilters = {};
  if (ipAddress) filters.address = ipAddress;
  if (userId) filters.user_id = userId;

  const { data: logs = { data: [] } } = useIpAccessLogs(filters);

  return useMemo(() => {
    const accessLogs = logs?.data || [];
    
    if (accessLogs.length === 0) {
      return { suspicious: false, reasons: [], logs: [] };
    }

    const reasons: string[] = [];
    let suspicious = false;

    // Check location-based suspicion
    const locationCheck = checkLocationSuspicion(accessLogs, ipAddress);
    if (locationCheck.suspicious && locationCheck.reason) {
      suspicious = true;
      reasons.push(locationCheck.reason);
    }

    // Check rapid access suspicion
    const rapidAccessCheck = checkRapidAccessSuspicion(accessLogs);
    if (rapidAccessCheck.suspicious && rapidAccessCheck.reason) {
      suspicious = true;
      reasons.push(rapidAccessCheck.reason);
    }

    return {
      suspicious,
      reasons,
      logs: accessLogs.slice(0, 20), // Return relevant logs
    };
  }, [logs, ipAddress]);
};

// Convenience Queries
export const useAccessLogsByIp = (ipAddress: string) => {
  return useIpAccessLogs({ address: ipAddress });
};

export const useAccessLogsByLocation = (location: string) => {
  return useIpAccessLogs({ location });
};

export const useAccessLogsByDevice = (device: string) => {
  return useIpAccessLogs({ device });
};

export const useAccessLogsInTimeRange = (startTime: string, endTime: string) => {
  return useIpAccessLogs({ start_time: startTime, end_time: endTime });
};

export const useRecentAccessLogs = (limit = 50) => {
  return useIpAccessLogs({ limit });
};
