import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usersService } from './service';
import type {
  User,
  UserCreate,
  UserUpdate,
  UserFilters,
  UserResponse,
  UsersListResponse,
} from './types';
import { BaseResponse } from '@/shared/api/types';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  byRole: (role: 'admin' | 'user') => [...userKeys.all, 'role', role] as const,
};

// Base Queries
export const useUsers = (
  filters?: UserFilters,
  options?: UseQueryOptions<User[]>
) => {
  return useQuery<User[]>({
    queryKey: userKeys.list(filters || {}),
    queryFn: () => usersService.getUsers(filters),
    ...options,
  });
};

export const useUserById = (
  userId: string,
  options?: UseQueryOptions<User | null>
) => {
  return useQuery<User | null>({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersService.getUserById(userId),
    ...options,
  });
};

// Mutations
export const useCreateUser = (
  options?: UseMutationOptions<User | null, Error, UserCreate>
) => {
  return useMutation({
    mutationFn: (data: UserCreate) => usersService.createUser(data),
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<User | null, Error, { id: string; data: UserUpdate }>
) => {
  return useMutation({
    mutationFn: ({ id, data }) => usersService.updateUser(id, data),
    ...options,
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<boolean, Error, string>
) => {
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    ...options,
  });
};

export const useUpdateLastLogin = (
  options?: UseMutationOptions<boolean, Error, string>
) => {
  return useMutation({
    mutationFn: (userId: string) => usersService.updateLastLogin(userId),
    ...options,
  });
};

// Advanced Queries
export const useUserStats = (options?: UseQueryOptions<{
  total: number;
  active: number;
  inactive: number;
  admins: number;
  users: number;
}>) => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => usersService.getUserStats(),
    ...options,
  });
};

export const useSearchUsers = (
  query: string,
  options?: UseQueryOptions<User[]>
) => {
  return useQuery<User[]>({
    queryKey: userKeys.search(query),
    queryFn: () => usersService.searchUsers(query),
    enabled: !!query,
    ...options,
  });
};

// Convenience Queries
export const useUsersByRole = (
  role: 'admin' | 'user',
  options?: UseQueryOptions<User[]>
) => {
  return useQuery<User[]>({
    queryKey: userKeys.byRole(role),
    queryFn: () => usersService.getUsersByRole(role),
    ...options,
  });
};

export const useActiveUsers = (options?: UseQueryOptions<User[]>) => {
  return useUsers({ is_active: true }, options);
};

export const useAdminUsers = (options?: UseQueryOptions<User[]>) => {
  return useUsersByRole('admin', options);
};

export const useRegularUsers = (options?: UseQueryOptions<User[]>) => {
  return useUsersByRole('user', options);
};
