import { AxiosRequestConfig } from 'axios';
import { httpClient } from '@/shared/api';
import {
  IpAccess,
  IpAccessCreate,
  IpAccessUpdate,
  IpAccessFilters,
  IpAccessResponse,
  IpAccessListResponse
} from './types';
import { BaseResponse } from '../../shared/api/types';

export const ipAccessApi = {
  // Get all IP access logs with filters
  getIpAccessLogs: async (filters?: IpAccessFilters, config?: AxiosRequestConfig): Promise<IpAccessListResponse> => {
    const { data } = await httpClient.get('/api/v1/ip-access', {
      params: filters,
      ...config,
    });
    return data;
  },

  // Get IP access log by ID
  getIpAccessById: async (accessId: string, config?: AxiosRequestConfig): Promise<IpAccessResponse> => {
    const { data } = await httpClient.get(`/api/v1/ip-access/${accessId}`, config);
    return data;
  },

  // Create new IP access log
  createIpAccess: async (ipAccessData: IpAccessCreate, config?: AxiosRequestConfig): Promise<IpAccessResponse> => {
    const { data } = await httpClient.post('/api/v1/ip-access', ipAccessData, config);
    return data;
  },

  // Update IP access log
  updateIpAccess: async (accessId: string, ipAccessData: IpAccessUpdate, config?: AxiosRequestConfig): Promise<IpAccessResponse> => {
    const { data } = await httpClient.put(`/api/v1/ip-access/${accessId}`, ipAccessData, config);
    return data;
  },

  // Delete IP access log
  deleteIpAccess: async (accessId: string, config?: AxiosRequestConfig): Promise<BaseResponse> => {
    const { data } = await httpClient.delete(`/api/v1/ip-access/${accessId}`, config);
    return data;
  },

  // Get IP access logs by user ID
  getUserIpAccess: async (userId: string, page = 1, limit = 50, config?: AxiosRequestConfig): Promise<IpAccessListResponse> => {
    const { data } = await httpClient.get(`/api/v1/ip-access/user/${userId}`, {
      params: { page, limit },
      ...config,
    });
    return data;
  },

  // Delete all IP access logs for a user
  deleteUserIpAccess: async (userId: string, config?: AxiosRequestConfig): Promise<BaseResponse> => {
    const { data } = await httpClient.delete(`/api/v1/ip-access/user/${userId}`, config);
    return data;
  },
};