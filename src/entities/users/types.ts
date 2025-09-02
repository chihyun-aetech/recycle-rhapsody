export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  affiliation: string;
  is_active: boolean;
  created_date: string;
  last_logged_at?: string | null;
  updated_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  affiliation: string;
}

export interface UserUpdate {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: 'admin' | 'user' | null;
  affiliation?: string | null;
  is_active?: boolean | null;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  affiliation?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  data: User[];
}