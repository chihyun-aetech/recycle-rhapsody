export interface IpAccess {
  id: string;
  user_id: string;
  address: string;
  location?: string | null;
  device?: string | null;
  first_accessed_at: string;
  last_accessed_at?: string | null;
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface IpAccessCreate {
  user_id: string;
  address: string;
  location?: string | null;
  device?: string | null;
}

export interface IpAccessUpdate {
  location?: string | null;
  device?: string | null;
  last_accessed_at?: string | null;
}

export interface IpAccessFilters {
  user_id?: string;
  address?: string;
  location?: string;
  device?: string;
  start_time?: string;
  end_time?: string;
  page?: number;
  limit?: number;
}

export interface IpAccessResponse {
  success: boolean;
  message: string;
  data?: IpAccess;
}

export interface IpAccessListResponse {
  success: boolean;
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  data: IpAccess[];
}

export interface IpAccessStats {
  total_accesses: number;
  unique_ips: number;
  unique_users: number;
  top_locations: Array<{
    location: string;
    count: number;
  }>;
  top_devices: Array<{
    device: string;
    count: number;
  }>;
  recent_accesses: IpAccess[];
}