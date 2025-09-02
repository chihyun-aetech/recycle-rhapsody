import { httpClient } from '@/shared/api';
import type {
  IpAccess,
  IpAccessCreate,
  IpAccessUpdate,
  IpAccessFilters,
  IpAccessResponse,
  IpAccessListResponse,
} from './types';
import { BaseResponse } from '../../shared/api/types';

export const ipAccessService = {
  // Get all IP access logs with filters
  async getIpAccessLogs(filters?: IpAccessFilters): Promise<IpAccessListResponse> {
    const { data } = await httpClient.get<IpAccessListResponse>('/api/v1/ip-access', { params: filters });
    return data;
  },

  // Get IP access log by ID
  async getIpAccessById(accessId: string): Promise<IpAccessResponse> {
    const { data } = await httpClient.get<IpAccessResponse>(`/api/v1/ip-access/${accessId}`);
    return data;
  },

  // Create new IP access log
  async createIpAccess(ipAccessData: IpAccessCreate): Promise<IpAccessResponse> {
    const { data } = await httpClient.post<IpAccessResponse>('/api/v1/ip-access', ipAccessData);
    return data;
  },

  // Update IP access log
  async updateIpAccess(accessId: string, ipAccessData: IpAccessUpdate): Promise<IpAccessResponse> {
    const { data } = await httpClient.put<IpAccessResponse>(`/api/v1/ip-access/${accessId}`, ipAccessData);
    return data;
  },

  // Delete IP access log
  async deleteIpAccess(accessId: string): Promise<BaseResponse> {
    const { data } = await httpClient.delete<BaseResponse>(`/api/v1/ip-access/${accessId}`);
    return data;
  },

  // Get IP access logs by user ID
  async getUserIpAccess(userId: string, page = 1, limit = 50): Promise<IpAccessListResponse> {
    const { data } = await httpClient.get<IpAccessListResponse>(`/api/v1/ip-access/user/${userId}`, {
      params: { page, limit },
    });
    return data;
  },

  // Delete all IP access logs for a user
  async deleteUserIpAccess(userId: string): Promise<BaseResponse> {
    const { data } = await httpClient.delete<BaseResponse>(`/api/v1/ip-access/user/${userId}`);
    return data;
  },
};
