import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/shared/hooks/use-toast';

export interface User {
  serialnumber: number;
  email: string;
  name: string;
  phone: string;
  level: 'admin' | 'user';
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        
        toast({
          title: "로그인 성공",
          description: data.user.level === 'admin' ? "관리자로 로그인되었습니다." : "로그인되었습니다.",
          duration: 3000,
        });
        
        return true;
      } else {
        toast({
          title: "로그인 실패",
          description: data.error || "로그인에 실패했습니다.",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "로그인 오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "회원가입 완료",
          description: "성공적으로 가입되었습니다.",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "회원가입 실패",
          description: data.error || "회원가입에 실패했습니다.",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "회원가입 오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다.",
    });
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        toast({
          title: "계정 삭제",
          description: "계정이 성공적으로 삭제되었습니다.",
        });
        return true;
      } else {
        toast({
          title: "계정 삭제 실패",
          description: data.error || "계정 삭제에 실패했습니다.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "계정 삭제 오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    deleteAccount,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};