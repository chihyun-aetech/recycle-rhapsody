import { 
  User, 
  UserCreate, 
  UserUpdate, 
  UserFilters, 
  UserResponse, 
  UsersListResponse 
} from './types';
// import { BaseResponse } from '../system';
import { httpClient } from '@/shared/api/config';

const API_BASE = '/api/v1/users';

export const usersApi = {
  // Get all users with filters
  getUsers: async (filters?: UserFilters): Promise<UsersListResponse> => {
    try {
      const { data } = await httpClient.get(API_BASE, { params: filters });
      return data;
    } catch (error: any) {
      console.error('Failed to fetch users:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<UserResponse> => {
    try {
      const { data } = await httpClient.get(`${API_BASE}/${userId}`);
      return data;
    } catch (error: any) {
      console.error('Failed to fetch user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Create new user
  createUser: async (userData: UserCreate): Promise<UserResponse> => {
    try {
      const { data } = await httpClient.post(API_BASE, userData);
      return data;
    } catch (error: any) {
      console.error('Failed to create user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user
  updateUser: async (userId: string, userData: UserUpdate): Promise<UserResponse> => {
    try {
      const { data } = await httpClient.put(`${API_BASE}/${userId}`, userData);
      return data;
    } catch (error: any) {
      console.error('Failed to update user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<UserResponse> => {
    try {
      const { data } = await httpClient.delete(`${API_BASE}/${userId}`);
      return data;
    } catch (error: any) {
      console.error('Failed to delete user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Update last login time
  updateLastLogin: async (userId: string): Promise<UserResponse> => {
    try {
      const { data } = await httpClient.patch(`${API_BASE}/${userId}/login`);
      return data;
    } catch (error: any) {
      console.error('Failed to update last login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update last login');
    }
  },
};