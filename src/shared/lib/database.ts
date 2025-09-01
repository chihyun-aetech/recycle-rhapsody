export interface User {
  serialnumber: number;
  email: string;
  hashed_password: string;
  name: string;
  phone: string;
  level: 'admin' | 'user';
  is_active: boolean;
  create_at: string;
  is_deleted: boolean;
  update_at: string;
}

export class UserDatabase {
  private users: User[] = [
    {
      serialnumber: 1,
      email: 'admin@aetech.co.kr',
      hashed_password: 'admin1234',
      name: '관리자',
      phone: '010-0000-0000',
      level: 'admin',
      is_active: true,
      create_at: '2024-01-01T00:00:00.000Z',
      is_deleted: false,
      update_at: '2024-01-01T00:00:00.000Z'
    },
    {
      serialnumber: 2,
      email: 'user@test.com',
      hashed_password: 'password123',
      name: '김테스트',
      phone: '010-1234-5678',
      level: 'user',
      is_active: true,
      create_at: '2024-01-02T00:00:00.000Z',
      is_deleted: false,
      update_at: '2024-01-02T00:00:00.000Z'
    },
    {
      serialnumber: 3,
      email: 'user2@test.com',
      hashed_password: 'password456',
      name: '이사용자',
      phone: '010-2345-6789',
      level: 'user',
      is_active: true,
      create_at: '2024-01-03T00:00:00.000Z',
      is_deleted: false,
      update_at: '2024-01-03T00:00:00.000Z'
    }
  ];

  private getNextSerialNumber(): number {
    return Math.max(...this.users.map(u => u.serialnumber), 0) + 1;
  }

  getAllUsers(): User[] {
    return this.users.filter(user => !user.is_deleted);
  }

  getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email === email && !user.is_deleted) || null;
  }

  getUserById(id: number): User | null {
    return this.users.find(user => user.serialnumber === id && !user.is_deleted) || null;
  }

  createUser(userData: Omit<User, 'serialnumber' | 'create_at' | 'update_at' | 'is_deleted'>): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      serialnumber: this.getNextSerialNumber(),
      create_at: now,
      update_at: now,
      is_deleted: false
    };
    
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, updates: Partial<Omit<User, 'serialnumber' | 'create_at'>>): User | null {
    const userIndex = this.users.findIndex(user => user.serialnumber === id && !user.is_deleted);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...this.users[userIndex],
      ...updates,
      update_at: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.serialnumber === id && !user.is_deleted);
    if (userIndex === -1) return false;

    this.users[userIndex] = {
      ...this.users[userIndex],
      is_deleted: true,
      update_at: new Date().toISOString()
    };

    return true;
  }

  validateCredentials(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user || !user.is_active) return null;
    
    if (user.hashed_password === password) {
      return user;
    }
    
    return null;
  }
}

export const userDatabase = new UserDatabase();