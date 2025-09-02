import { usersApi } from './api';
import { User, UserCreate, UserUpdate, UserFilters } from './types';

export class UsersService {
  // Get all users with optional filters
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const response = await usersApi.getUsers(filters);
    return response.data;
  }

  // Get user by ID with error handling
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await usersApi.getUserById(userId);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  }

  // Create new user with validation
  async createUser(userData: UserCreate): Promise<User | null> {
    try {
      // Basic validation
      if (!userData.name?.trim()) {
        throw new Error('User name is required');
      }
      if (!userData.email?.trim()) {
        throw new Error('User email is required');
      }
      if (!userData.password?.trim()) {
        throw new Error('User password is required');
      }
      if (!userData.affiliation?.trim()) {
        throw new Error('User affiliation is required');
      }

      const response = await usersApi.createUser(userData);
      return response.data || null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user with partial data
  async updateUser(userId: string, userData: UserUpdate): Promise<User | null> {
    try {
      const response = await usersApi.updateUser(userId, userData);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await usersApi.deleteUser(userId);
      return response.success;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      return false;
    }
  }

  // Update last login time
  async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const response = await usersApi.updateLastLogin(userId);
      return response.success;
    } catch (error) {
      console.error(`Error updating last login for user ${userId}:`, error);
      return false;
    }
  }

  // Get users by role
  async getUsersByRole(role: 'admin' | 'user'): Promise<User[]> {
    return this.getUsers({ role });
  }

  // Get active users only
  async getActiveUsers(): Promise<User[]> {
    return this.getUsers({ is_active: true });
  }

  // Search users by name or email
  async searchUsers(query: string): Promise<User[]> {
    const [usersByName, usersByEmail] = await Promise.all([
      this.getUsers({ name: query }),
      this.getUsers({ email: query }),
    ]);

    // Combine and deduplicate results
    const allUsers = [...usersByName, ...usersByEmail];
    const uniqueUsers = allUsers.filter((user, index, arr) => 
      arr.findIndex(u => u.id === user.id) === index
    );

    return uniqueUsers;
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
  }> {
    const allUsers = await this.getUsers();
    
    return {
      total: allUsers.length,
      active: allUsers.filter(u => u.is_active).length,
      inactive: allUsers.filter(u => !u.is_active).length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      users: allUsers.filter(u => u.role === 'user').length,
    };
  }
}

// Export singleton instance
export const usersService = new UsersService();